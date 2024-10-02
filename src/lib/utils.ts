
// Remove diatrics and convert string to lowercase
export function normalize(str: string) {
    // Remove diatrics (accents)
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Replace apostrophes and spaces by dashes 
    str = str.replace(/[\s+']/g, '-');
    return str.toLowerCase();
}