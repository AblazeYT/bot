export async function generate_image(prompt: string): Promise<Buffer> {

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
          "mode": "cors",
          "credentials": "omit"
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
        }).then(res => res.json());

        if (image_data.status === "succeeded") {
            const image = await fetch(`https://images.prodia.xyz/${jobData.job}.png?download=1`).then(res => res.arrayBuffer());

            return Buffer.from(image);
        }
    }
}