export const meId = "ou-ei69Rf_8HDxtcL7-xreUabzGg";
export const herId = "ou-ei6ykAmy3LndC12ry6ozLmVQ0";
export const me = "张敬峥";
export const her = "王振伟";
export const templateId = "Ig50Aytvx99WHCZ8n8eZtsg3cETyeVXGj3UXTDnavhQ";

export async function getOpenId() {
    return wx.cloud.callFunction({ name: 'getOpenId' }).then(r => r.result);
}

export async function getCurrentName() {
    const currentId = await getOpenId();
    return currentId === meId ? me : her;
}