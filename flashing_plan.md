# Flashing UI Overhaul Plan

## Goal
Update the `flashing` phase of the `OddiyHisobGameScreen` to match the provided design.

## Changes
1. **Background**: Use `<ImageBackground>` with `require('../assets/oddiy_hisob_bg.jpg')` for the entire screen, replacing the solid `#0B1120` background (or apply it via a wrapper). Since `SafeAreaView` is used, we can make the `ImageBackground` the root element, and `SafeAreaView` inside it.
2. **Top Bar**: Update styles of `backBtn`, `energyBadge`, `coinBadge` to match the dark, slightly transparent look with borders.
3. **Flashing Card (`renderFlashingArea`)**:
   - Create a centered card container: `width: '85%'`, `aspectRatio: 1`, `backgroundColor: 'rgba(10,20,40,0.6)'`, `borderColor: '#3B82F6'`, `borderWidth: 1`, `borderRadius: 24`.
   - Large number: `fontSize: 80`, white, bold.
   - Operator: Rounded square, neon green (or dynamic), with white icon/text.
   - Subtext: "SONNI YODDA SAQLANG!"
   - Dots indicator below the text.
4. **Bottom Area (`renderFlashingBottom`)**:
   - During `flashing` and `countdown`, hide the "Maslahat" and stats.
   - Display a floating timer text: `<MaterialCommunityIcons name="hourglass" /> {speed}s` positioned absolutely at the bottom right to align with the background's dotted circle.
   - Position: `bottom: 50`, `right: 50` (adjust via styles).
5. **Phase Logic**:
   - The background image looks best if applied globally so it doesn't jump, but the floating numbers might conflict with the input phase. I'll apply it globally and just let it be covered by the input phase wrapper if needed. Or better, just apply it globally, it looks cool.

