# Feb 6 Handoff – AI Hero Editor

## What changed
- Added layout selector plus particles/animation/parallax/gradient overlay controls in the Hero editor settings; inline text color retained for all text inputs/selects. See [components/HeroEditor.tsx](components/HeroEditor.tsx#L276-L420).
- AI hero variants, defaults, and animation/particle helpers remain centralized in [components/AiHeroLibrary.tsx](components/AiHeroLibrary.tsx#L1-L220).

## Pending / risks
- `ai/heroGenerator.ts` still emits legacy layout keys and lacks new fields (particleColor, gradientOverlay, parallax, animationType). Update prompt/output mapping to the new variants.
- `AIHeroPreview` and `HeroDesignerModal` still render legacy components; rewire to `AI_HERO_COMPONENTS` with the new `HeroData` shape.
- Consider validation/help for gradient overlay class input and sensible parallax defaults per layout.

## Testing
- Not run (UI-only changes).

## Branch / notes
- Branch: designerv2. Only staged files should be `components/HeroEditor.tsx`, `components/AiHeroLibrary.tsx`, and this handoff; other modified files exist in the tree and were left untouched.
