export const profileDataPath = '//code';
export const containsText = '"$type":"com.linkedin.voyager.common.Me"';
const $x = xp => {
    const snapshot = document.evaluate(
        xp, document, null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
    );
    return [...Array(snapshot.snapshotLength)]
        .map((_, i) => snapshot.snapshotItem(i));
}

export const getProfileData = (xpath, containsText) => {
    const l = $x(xpath);
    let userUid = "";
    let publicIdentifier = "";
    for (let i = 0; i < l.length; i++) {
        if (l[i].innerText.includes(containsText)) {
            const data = JSON.parse(l[i].innerText).data;
            if (data && data.hasOwnProperty("*miniProfile")) {
                const uidText = data['*miniProfile'];
                userUid = uidText.split(":")[3];
            }
            const included = JSON.parse(l[i].innerText).included[0];
            if (included && included.hasOwnProperty("publicIdentifier")) {
                publicIdentifier = included['publicIdentifier'];
            }
        }
    }
    return {"userUid": userUid ,"publicIdentifier" : publicIdentifier};
}

