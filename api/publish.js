export default async function handler(req, res) {
  /*
    Vercel API route for Siong Design admin publish.
    Put this file at: api/publish.js

    Required Vercel Environment Variables:
    - GITHUB_TOKEN  = Fine-grained GitHub token with Contents: Read and write
    - GITHUB_OWNER  = stnlysee
    - GITHUB_REPO   = siongdesign
    - GITHUB_BRANCH = main
  */

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || "stnlysee";
  const repo = process.env.GITHUB_REPO || "siongdesign";
  const branch = process.env.GITHUB_BRANCH || "main";
  const filePath = "content/site-content.json";

  if (req.method === "GET") {
    if (!token) {
      return res.status(500).json({
        ok: false,
        error: "Missing GITHUB_TOKEN in Vercel Environment Variables"
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Publish API is ready",
      owner,
      repo,
      branch,
      filePath
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    if (!token) {
      return res.status(500).json({
        ok: false,
        error: "Missing GITHUB_TOKEN in Vercel Environment Variables"
      });
    }

    const body = req.body;

    if (!body || !body.content) {
      return res.status(400).json({
        ok: false,
        error: "Missing content in request body"
      });
    }

    const jsonText = JSON.stringify(body.content, null, 2);
    const encodedContent = Buffer.from(jsonText, "utf8").toString("base64");

    const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

    const getRes = await fetch(getUrl, {
      method: "GET",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "siongdesign-admin"
      }
    });

    let sha = null;

    if (getRes.ok) {
      const latestFile = await getRes.json();
      sha = latestFile.sha;
    } else if (getRes.status !== 404) {
      const errText = await getRes.text();
      return res.status(getRes.status).json({
        ok: false,
        error: "Failed to fetch latest site-content.json from GitHub",
        details: errText
      });
    }

    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const putRes = await fetch(putUrl, {
      method: "PUT",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        "User-Agent": "siongdesign-admin"
      },
      body: JSON.stringify({
        message: "Update website content from admin portal",
        content: encodedContent,
        branch,
        ...(sha ? { sha } : {})
      })
    });

    const putText = await putRes.text();

    if (!putRes.ok) {
      return res.status(putRes.status).json({
        ok: false,
        error: "GitHub publish failed",
        details: putText
      });
    }

    return res.status(200).json({
      ok: true,
      success: true,
      message: "Published successfully"
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Server publish error",
      details: error.message
    });
  }
}
