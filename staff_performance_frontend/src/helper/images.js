export const getPreview = (fileUpload) => {
    let file = fileUpload.files[0];
    if(undefined !== file)
    {
        return URL.createObjectURL(file);
    }
    return null;
}