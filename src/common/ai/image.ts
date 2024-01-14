export async function generate_image(prompt: string): Promise<Buffer> {
    const urlParams = new URLSearchParams({
        new: "true",
        prompt: prompt,
        model: "Realistic_Vision_V2.0.safetensors [79587710]",
        negative_prompt: "((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), out of frame, extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), out of frame, extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))) , ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), out of frame, extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck)))",

        steps: "30",
        cfg: "9.5",
        seed: Math.floor(10_000 + (Math.random() * 89_999)).toString(),
        sampler: "Euler",
        aspect_ratio: "square",
    });

    const res = await fetch("https://api.prodia.com/generate?" + urlParams.toString(), {
        method: "GET",
        headers: {
            "authority": "api.prodia.com",
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.6",
            "dnt": "1",
            "origin": "https://app.prodia.com",
            "referer": "https://app.prodia.com/",
            "sec-ch-ua": '"Brave";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        },
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