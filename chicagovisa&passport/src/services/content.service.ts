
export const fetchHomepageContent = async () => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_BASEURL || "http://localhost:8002/api/v1";
        const res = await fetch(`${apiUrl}/content/homepage`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Status: ${res.status}`);
        }

        const json = await res.json();
        return json.data || json; // Handle both wrapper styles
    } catch (error) {
        console.error("Failed to fetch homepage content:", error);
        return null;
    }
};
