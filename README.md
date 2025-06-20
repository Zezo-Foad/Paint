## 🎯 Hands-on Test for Every `Paint.css` Function
 
 
Assumes `Paint` is already loaded and available globally.
 
  
### 1. `Paint(selector, cssText)`
 
 
Dynamically inject CSS rules to the given selector.
 
 `Paint(".demo", "background: yellow; color: black; padding: 10px;"); ` 
📌 **Result**: Any element with the class `.demo` gets a yellow background and black text.
  
### 2. `.hover(styles)` or any pseudo-class
 
 
Add rules for pseudo-classes like `:hover`, `:focus`, etc.
 
 `Paint(".demo", "border-radius: 6px;").hover("background: orange;"); Paint(".demo").focus("outline: 2px solid blue;"); ` 
📌 **Result**: On hover or focus, the style changes accordingly.
  
### 3. `Paint.getCSS(selector)`
 
 
Returns the full CSS string for a given selector.
 
 `console.log(Paint.getCSS(".demo")); ` 
🖨️ **Output**:
 `background: yellow; color: black; padding: 10px; border-radius: 6px; `  
### 4. `Paint.getCSSObj(selector)`
 
 
Returns a live `CSSStyleDeclaration` object.
 
 `let styleObj = Paint.getCSSObj(".demo"); console.log(styleObj.getPropertyValue("background")); ` 
🖨️ **Output**:
 `yellow `  
### 5. `Paint.simulate({ selector, pusedo, times, timeout })`
 
 
Simulates a pseudo-class like `:hover` without actual user interaction.
 
 `Paint.simulate({   selector: ".demo",   pusedo: ":hover",   times: 3,   timeout: 500 }); ` 
📌 **Result**: The `.demo` element will simulate `:hover` style 3 times in a row.
  
### 6. `Paint.root.set(varName, value)`
 
 
Set a CSS variable in the `:root`.
 
 `Paint.root.set("--main-color", "#0f0"); ` 
📌 **Result**: Adds the variable `--main-color` with the value `#0f0`.
  
### 7. `Paint.root.get(varName)`
 
 
Retrieve the value of a CSS variable from `:root`.
 
 `console.log(Paint.root.get("--main-color")); ` 
🖨️ **Output**:
 `#0f0 `  
### 8. `Paint.root.delete(varName)`
 
 
Removes a CSS variable from `:root`.
 
 `Paint.root.delete("--main-color"); ` 
📌 **Result**: The variable is removed from the root.
  
## ✅ Conclusion
 
With **Paint.css**, you can:
 
 
- Inject CSS rules in real-time.
 
- Simulate pseudo-classes like `:hover` or `:focus`.
 
- Access and manipulate CSS styles.
 
- Work with `:root` variables easily.
 
- Build reactive, dynamic styling systems without touching the DOM.
