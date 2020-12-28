export const isNullOrEmpty = (v: any): boolean => {
    return (
        v == undefined || v == null || 
        (typeof v === 'string' || Array.isArray(v) ? v.length < 1 : false)
    );
}
