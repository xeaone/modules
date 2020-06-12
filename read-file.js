
export default function (data) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = (error) => reject(error);
        reader.onload = (events) => resolve(events.target.result);
        reader.readAsText(data);
    });
}
