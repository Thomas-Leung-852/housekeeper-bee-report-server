import express from 'express';
import { dbInstance as db } from '../utils/nosqlDbTools.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Default settings — keep in sync with DEFAULT_APP_SETTINGS in
// AppSettingDialog.jsx.  This copy drives seeding and type-validation.
// Rule: insertIfNotExists means user-changed values are NEVER overwritten
// by a server restart.
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_APP_SETTINGS = [
    {
        doc_type:     'app_setting',
        group:        'General',
        sub_group:    null,
        item:         'timeout',
        display_name: 'Session Timeout',
        description:  'How long a user session stays active without interaction before expiring.',
        display_seq:  1,
        data_type:    'integer',
        unit:         'seconds',
        val:          180
    },
    {
        doc_type:     'app_setting',
        group:        'Security',
        sub_group:    'iframe sandbox',
        item:         'allow-scripts',
        display_name: 'Allow Scripts',
        description:  'Allows reports to run JavaScript. Required for charts, interactive tables, and all dynamic report features.',
        display_seq:  1,
        data_type:    'boolean',
        unit:         null,
        val:          true
    },
    {
        doc_type:     'app_setting',
        group:        'Security',
        sub_group:    'iframe sandbox',
        item:         'allow-popups',
        display_name: 'Allow Popups',
        description:  'Allows reports to open a popup window. Required for drill-down features that show storage box details.',
        display_seq:  2,
        data_type:    'boolean',
        unit:         null,
        val:          true
    },
    {
        doc_type:     'app_setting',
        group:        'Security',
        sub_group:    'iframe sandbox',
        item:         'allow-popups-to-escape-sandbox',
        display_name: 'Allow Popups to Escape Sandbox',
        description:  'Allows popup windows opened by a report to run fully. Required for drill-down detail windows to be interactive.',
        display_seq:  3,
        data_type:    'boolean',
        unit:         null,
        val:          true
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// seedDefaultAppSettings()
// Call once at server start (in your main server entry file, e.g. server.js).
// Uses insertIfNotExists so existing user-modified values are preserved.
// New settings added to DEFAULT_APP_SETTINGS in a future release are
// automatically inserted on the next restart.
// ─────────────────────────────────────────────────────────────────────────────
export const seedDefaultAppSettings = () => {
    DEFAULT_APP_SETTINGS.forEach(setting => {
        db.insertIfNotExists(setting, ['doc_type', 'group', 'sub_group', 'item']);
    });
    console.log(`[AppSettings] Seeded ${DEFAULT_APP_SETTINGS.length} default settings.`);
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper — find the registered default for a given setting identity.
// Used for type-validation on PATCH.
// ─────────────────────────────────────────────────────────────────────────────
const findDefault = (group, sub_group, item) =>
    DEFAULT_APP_SETTINGS.find(
        s =>
            s.group        === group &&
            (s.sub_group ?? null) === (sub_group ?? null) &&
            s.item         === item
    );

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/app-settings
// Returns all app_setting documents.
// Already sorted server-side: group → sub_group → display_seq
// so the client can render without sorting.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const docs = await db.findDocuments();

        const settings = (docs || [])
            .filter(d => d.doc_type === 'app_setting')
            .sort((a, b) => {
                // 1. group
                if (a.group !== b.group) return a.group.localeCompare(b.group);
                // 2. sub_group  (null → floats before named sub-groups)
                const sgA = a.sub_group ?? '';
                const sgB = b.sub_group ?? '';
                if (sgA !== sgB) return sgA.localeCompare(sgB);
                // 3. display_seq
                return (a.display_seq ?? 99) - (b.display_seq ?? 99);
            });

        res.json(settings);
    } catch (err) {
        console.error('[AppSettings] GET /app-settings error:', err);
        res.status(500).json({ error: 'Failed to load app settings' });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/app-settings
// Updates the `val` of one setting.
// Identity key  : group + sub_group + item
// Mutable field : val only — display_name, description, data_type, unit, etc.
//                 are owned by the server and never changed from the client.
//
// Body: { group, sub_group, item, val }
//   sub_group may be null or omitted for top-level items.
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/', async (req, res) => {
    const { group, item, val } = req.body;
    const sub_group = req.body.sub_group ?? null;   // normalise missing → null

    // ── Required field check ──────────────────────────────────────────────
    if (!group || !item || val === undefined) {
        return res.status(400).json({ error: 'group, item and val are required' });
    }

    // ── Must be a known setting ───────────────────────────────────────────
    const knownSetting = findDefault(group, sub_group, item);
    if (!knownSetting) {
        return res.status(404).json({ error: `Unknown setting: ${group} / ${sub_group} / ${item}` });
    }

    // ── Type coercion & validation ────────────────────────────────────────
    let coercedVal;
    switch (knownSetting.data_type) {
        case 'boolean':
            if (typeof val !== 'boolean') {
                return res.status(400).json({ error: 'val must be a boolean for this setting' });
            }
            coercedVal = val;
            break;

        case 'integer': {
            coercedVal = parseInt(val, 10);
            if (isNaN(coercedVal)) {
                return res.status(400).json({ error: 'val must be an integer for this setting' });
            }
            break;
        }

        default:
            coercedVal = val;
    }

    // ── Persist ───────────────────────────────────────────────────────────
    try {
        db.editOrAddDocument(
            { doc_type: 'app_setting', group, sub_group, item },
            { val: coercedVal }
        );
        console.log(`[AppSettings] Updated: ${group}/${sub_group ?? '-'}/${item} = ${coercedVal}`);
        res.json({ result: 'success', group, sub_group, item, val: coercedVal });
    } catch (err) {
        console.error('[AppSettings] PATCH /app-settings error:', err);
        res.status(500).json({ error: 'Failed to update setting' });
    }
});

export default router;
