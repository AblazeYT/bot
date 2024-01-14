import proxyAgent from "https-proxy-agent";
const proxies = `45.90.248.189:12323:14aae7b844eaa:664b9de4cd
194.124.144.109:12323:14aae7b844eaa:664b9de4cd
45.91.33.180:12323:14aae7b844eaa:664b9de4cd
185.232.167.157:12323:14aae7b844eaa:664b9de4cd
193.3.176.193:12323:14aae7b844eaa:664b9de4cd`
export async function generate_image(prompt: string): Promise<Buffer> {
    const fetch = await import("node-fetch").then(m => m.default);
    const proxy = proxies.split("\n")[Math.floor(Math.random() * proxies.split("\n").length)].split(":");
    const res = await fetch("https://api.prodia.com/generate?new=true&prompt=" + encodeURIComponent(prompt) + "&model=Realistic_Vision_V5.0.safetensors+%5B614d1063%5D&negative_prompt=&steps=20&cfg=7&seed=3296971322&sampler=DPM%2B%2B+2M+Karras&aspect_ratio=square", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
          },
          "referrer": "https://app.prodia.com/",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "method": "GET",
          agent: new proxyAgent.HttpsProxyAgent(`http://${proxy[2]}:${proxy[3]}@${proxy[0]}:${proxy[1]}`)
    });
    const jobData = <{ job: string | undefined }> await res.json();

    if (!jobData.job) {
        throw new Error("Failed to generate image");
    }

    while (true) {
        await new Promise(resolve => setTimeout(resolve, 400));

        const image_data = <{ status: string }> await fetch(`https://api.prodia.com/job/${jobData.job}`, {
            headers: {
                authority: "api.prodia.com",
                accept: "*/*",
            },
            agent: new proxyAgent.HttpsProxyAgent(`http://${proxy[2]}:${proxy[3]}@${proxy[0]}:${proxy[1]}`)
        }).then(res => res.json());

        if (image_data.status === "succeeded") {
            const image = await fetch(`https://images.prodia.xyz/${jobData.job}.png?download=1`).then(res => res.arrayBuffer());

            return Buffer.from(image);
        }
    }
}