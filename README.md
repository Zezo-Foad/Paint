
---

🎨 Paint.css API – Function Demonstration

> Paint.css is a powerful native CSS injection and simulation engine. Below is a full hands-on guide to using all built-in functions — no internal code, just pure usage examples.




---

🔧 1. Paint(selector, cssText)

Injects base styles into any selector.

Paint(".demo", "background: yellow; color: black; padding: 10px;");

✅ Effect:
Applies background and text styles to elements with .demo.


---

✨ 2. .hover(styles) / .focus(styles) / other pseudo-classes

Adds pseudo-class styles dynamically.

Paint(".demo", "border-radius: 6px;").hover("background: orange;");
Paint(".demo").focus("outline: 2px solid blue;");

✅ Effect:
When .demo is hovered or focused, the new styles apply.


---

📋 3. Paint.getCSS(selector)

Retrieves the raw CSS text applied to a selector.

console.log(Paint.getCSS(".demo"));

🖨️ Example Output:

background: yellow; color: black; padding: 10px; border-radius: 6px;


---

🧩 4. Paint.getCSSObj(selector)

Returns a live CSSStyleDeclaration object (read/write).

const style = Paint.getCSSObj(".demo");
console.log(style.getPropertyValue("background"));

🖨️ Output:

yellow

You can also modify or remove styles:

style.setProperty("background", "blue");
style.removeProperty("padding");


---

🎭 5. Paint.simulate({ selector, pusedo, times, timeout })

Simulates a pseudo-class style like :hover multiple times.

Paint.simulate({
  selector: ".demo",
  pusedo: ":hover",
  times: 3,
  timeout: 500
});

✅ Effect:
Paint temporarily applies the :hover style 3 times every 500ms.


---

🌱 6. Paint.root.set(variable, value)

Sets a CSS variable in the :root.

Paint.root.set("--main-color", "#0f0");

✅ Effect:
:root { --main-color: #0f0; }


---

🔍 7. Paint.root.get(variable)

Gets the value of a CSS variable.

const color = Paint.root.get("--main-color");
console.log(color); // #0f0


---

🧹 8. Paint.root.delete(variable)

Removes a CSS variable from :root.

Paint.root.delete("--main-color");

✅ Effect:
Removes the variable entirely.


---

🧠 Summary Table

Function	Description

Paint()	Injects base CSS
.hover() / .focus()	Injects pseudo-class CSS
Paint.getCSS()	Gets full style string for a selector
Paint.getCSSObj()	Gets the live editable style object
Paint.simulate()	Temporarily simulates a pseudo-class style
Paint.root.set()	Sets a CSS custom property
Paint.root.get()	Retrieves the value of a CSS variable
Paint.root.delete()	Deletes a CSS variable from :root



---

✅ Final Thoughts

> With Paint.css, you don’t just inject CSS — you control it, simulate it, and build dynamic styling systems with no framework or preprocessor needed.



If you'd like, I can prepare a sample HTML playground to try all this live. Just say the word!

