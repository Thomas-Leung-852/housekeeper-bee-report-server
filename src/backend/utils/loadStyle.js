export const loadStyle = async (styleName) => {
    try {
        const styles = await import(`../shared/${styleName}.js`);
        return styles.default; // Assuming you export default the styles
    } catch (error) {
        console.error(`Failed to load style ${styleName}: `, error);
        return null; // Handle error accordingly
    }
};