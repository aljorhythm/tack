export async function editMyTag(tackId: string, tagsString: string) {
    return await fetch(`/api/user/tack/${tackId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tagsString,
        }),
    });
}

const client = { editMyTag };

export default client;
