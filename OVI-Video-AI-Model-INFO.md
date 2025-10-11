# Ovi AI Video Model - Complete Reference Guide

## 🧠 1. Overview — What Ovi Actually Does

Ovi is a cross-modal "veo-3-like" model that fuses text, image, and audio representations to output a 5-second, 720×720 24 FPS video with synchronized audio.

It merges diffusion for video frames + an audio generation head for synchronized speech and sound.

Think of it as:
**"Runway Gen-3 + VALL-E Mini + FLUX" in one — but open-source.**

## ⚙️ 2. Key Configuration File (inference_fusion.yaml)

These are the most important tunable parameters and what they actually do (in plain English):

| Setting | Cloud Optimized Range | Description |
|---------|---------------------|-------------|
| `num_steps` | **50 – 60** | Denoising iterations — higher = smoother, more detailed frames |
| `solver_name` | **"dpmpp"** | Sampling algorithm. "dpmpp" provides sharper, higher quality results |
| `shift` | **5 – 6** | Temporal sampling shift — affects smoothness vs motion strength |
| `seed` | any int | Fix for reproducibility |
| `audio_guidance_scale` | **3.5 – 4.5** | Controls strength of audio conditioning — affects lip sync + sound clarity |
| `video_guidance_scale` | **5.0 – 7.0** | Controls how strictly visuals follow the text prompt |
| `slg_layer` | 9 – 13 | Skip-Layer Guidance position — experimenting here changes style vs accuracy |
| `video_negative_prompt` | "jitter, bad hands, blur, distortion" | Add artifacts to avoid |
| `audio_negative_prompt` | "robotic, muffled, echo, distorted" | Cleans audio output |
| `video_frame_height_width` | [512, 992] for 16:9 or [720, 720] for 1:1 | Choose aspect ratio per clip |
| `mode` | t2v, i2v, t2i2v | Text-only, image-conditioned, or text + auto image seed |

### 💡 Cloud Inference Optimization (Maximum Quality):
- **Disable memory optimization flags** - Use `fp8=False` + `cpu_offload=False` for best quality
- **Higher inference steps** - Use 50-60 steps for maximum detail and smoothness
- **Optimal guidance scales** - Higher values for better prompt adherence
- Keep videos ≤ 5 s until they release longer-clip support

## 🎨 3. Prompt Format (Critical)

Ovi reads special tags to decide what to synthesize:

### ✅ Working Template (Tested with fal-ai Ovi model)
```
A smiling salesman waves his hand beside an RV and gives a small nod

<S>"Hello there! Welcome to RV City"<E>
<S>"We've got the best deals under the sun"<E>
```

### 🧩 Rules for fal-ai Implementation:
- **Visual description first** → Plain text without commas or instructional text
- `<S>"speech"<E>` → Spoken lines must be in quotes within S tags
- **No AUDCAP tags** → These get read as speech, avoid them
- Keep each speech segment under ~10 words for best lip-sync
- Split speech at commas for natural breaks
- Remove all commas from visual descriptions
- Avoid instructional text like "Use input image as subject"

## 🧰 4. Pre-Processor (LLM Prompt Translator)

You can build a prompt translator in your chat app so users can type anything like:

**User Input:**
```
"Make the guy say 'I like apples' while waving his hand"
```

**Auto-Generated Output (Working Format):**
```
A cheerful man waves his hand and gives a small nod

<S>"I like apples!"<E>
```

This can be done with a small LLM wrapper (e.g., GPT-4-mini or Claude Haiku).

### Python Implementation:
```python
def format_for_ovi(user_text):
    prompt_template = f"""
Convert the user request into an Ovi-compatible prompt.
Use <S></E> for spoken words, <AUDCAP></ENDAUDCAP> for ambient sound,
and end with one descriptive sentence of visuals.

User request: "{user_text}"
"""
    return llm_api_call(prompt_template)
```

That function feeds the result to Ovi's `text_prompt`.

## 🧪 5. Cloud Inference YAML Preset (Maximum Quality)

Below is a ready-to-copy `inference_fusion.yaml` optimized for cloud inference with unlimited VRAM:

```yaml
output_dir: "./outputs"
ckpt_dir: "./ckpts"

# Maximum quality settings for cloud inference
num_steps: 55
solver_name: "dpmpp"
shift: 5.5
seed: 123

# Enhanced guidance for better quality
audio_guidance_scale: 4.0
video_guidance_scale: 6.0
slg_layer: 11

# Cloud inference - no memory constraints
sp_size: 1
cpu_offload: False
fp8: False

text_prompt: "./prompts/test.csv"
mode: ['t2v']
video_frame_height_width: [720, 720]
each_example_n_times: 1

# Enhanced negative prompts for higher quality
video_negative_prompt: "jitter, bad hands, blur, distortion, low quality, pixelated, artifacts"
audio_negative_prompt: "robotic, muffled, echo, distorted, low quality, compressed, static"
```

## 🧮 6. Cloud Inference Setup

| Setup Type | VRAM | Configuration | Quality Level |
|------------|------|---------------|---------------|
| **Cloud Inference (Recommended)** | Unlimited | `fp8: False`, `cpu_offload: False` | **Maximum** |
| A100 80 GB | 80 GB | Default settings | High |
| Multi-GPU Cloud | 4–8 GPUs | `torchrun --nproc_per_node N` | **Maximum** |
| Local RTX 4090 | 24 GB | `--cpu_offload --fp8` (reduced quality) | Medium |

## 🧠 7. Optimization Workflow

1. Pre-generate the prompt with your LLM
2. Feed it to `inference.py` or your Gradio wrapper
3. Iterate on `num_steps`, `video_guidance_scale`, and `audio_guidance_scale`
4. Keep a prompt log (CSV) so you can reuse and A/B test phrasing

For "talking head" scenes, ensure the `<AUDCAP>` includes clear cues like "camera close-up," "room tone," etc. — these help temporal alignment.

## 🎬 8. Sample Prompts You Can Use to Test

| Type | Working Example (Tested) |
|------|--------------------------|
| **Basic talking** | `A man smiles and talks to the camera and gives a small nod`<br><br>`<S>"I like apples!"<E>` |
| **Business scene** | `A woman walks across a crosswalk and gives a welcoming gesture`<br><br>`<S>"The future is now"<E>` |
| **Holiday theme** | `Christmas themed scene and gives a small nod`<br><br>`<S>"Happy holidays from our team!"<E>` |

## 🧰 9. Optional Advanced Ideas

- Add a prompt-refinement slider in your chat UI that adjusts `guidance_scale`
- Auto-detect "speech" phrases (with regex for quotes or verbs like say, tell, shout) to fill `<S>` tags automatically
- Store the YAML preset per user session for consistent batch results
- Consider fine-tuning later with LoRA adapters for custom characters or props

## ✅ 10. Cloud Inference Checklist for Maximum Quality

| Area | Cloud Optimized Setting | Target |
|------|-------------------------|--------|
| **Inference Steps** | `num_steps: 55` | **Maximum detail & smoothness** |
| **Guidance** | `video_guidance_scale: 6.0`, `audio_guidance_scale: 4.0` | **Superior prompt adherence** |
| **Memory Optimization** | `fp8: False`, `cpu_offload: False` | **No quality compromise** |
| **Solver** | `solver_name: "dpmpp"` | **Sharpest results** |
| **Prompt** | `<S>`, `<AUDCAP>` tags | Mandatory |
| **Duration** | 5 s | Limit |
| **Aspect Ratio** | 9:16 / 1:1 | Works best |
| **Preprocessor** | LLM prompt parser | Strongly recommended |