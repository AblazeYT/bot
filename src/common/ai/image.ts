export async function generate_image(prompt: string): Promise<Buffer> {
    const urlParams = new URLSearchParams({
        new: "true",
        prompt: prompt,
        model: "Realistic_Vision_V2.0.safetensors [79587710]",
        negative_prompt: "",

        steps: "20",
        seed: Math.floor(10_000 + (Math.random() * 89_999)).toString(),
        sampler: "Euler",
        aspect_ratio: "square",
    });

    const res = await fetch("https://api.prodia.com/generate?" + urlParams.toString(), {
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