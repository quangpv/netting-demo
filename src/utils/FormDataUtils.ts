export function formDataToJson(formData: FormData): string {
    let data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    })
    return JSON.stringify(data, null, 2);
}

export function objectToQueryString(obj: any) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}