
# CSS Artisan Painter Engine

A lightweight, powerful CSS manipulation engine that provides dynamic CSS injection and management capabilities for modern web applications.

## 🚀 Features

- **Dynamic CSS Injection**: Programmatically insert CSS rules at runtime
- **Pseudo-class Support**: Easy handling of CSS pseudo-classes with proxy-based API
- **CSS Rule Retrieval**: Query and retrieve existing CSS rules by selector
- **Root Variable Management**: Convenient CSS custom property (CSS variables) management
- **Animation Simulation**: Built-in CSS animation simulation capabilities
- **Fallback Support**: Automatic fallback for environments without CSSStyleSheet support
- **Zero Dependencies**: Pure JavaScript implementation

## 📦 Installation

Simply include the script in your HTML file:

```html
<script src="path/to/css-painter-engine.js"></script>
```

The engine automatically initializes and creates a global `Paint` function.

## 🔧 API Reference

### Core Functions

#### `Paint(selector, cssText)`

Inject CSS rules dynamically and get pseudo-class support.

```javascript
// Basic usage
Paint('.my-element', 'color: red; font-size: 16px;');

// With pseudo-classes
Paint('.button', 'background: blue; color: white;')
  .hover('background: darkblue;')
  .active('transform: scale(0.95);');
```

#### `Paint.getCSSObj(selector, options)`

Retrieve CSS rule objects by selector.

```javascript
// Get single rule object
const ruleObj = Paint.getCSSObj('.my-element');

// Get multiple rules
const rules = Paint.getCSSObj('.my-element', { multiple: true });

// Filter by pseudo-classes
const pseudoOnly = Paint.getCSSObj('.button', { pusedo: 'only' });
const noPseudo = Paint.getCSSObj('.button', { pusedo: false });
```

#### `Paint.getCSS(selector, options)`

Retrieve CSS text by selector.

```javascript
// Get CSS text
const cssText = Paint.getCSS('.my-element');

// Get multiple CSS texts
const cssTexts = Paint.getCSS('.my-element', { multiple: true });
```

### CSS Variables Management

#### `Paint.root`

Manage CSS custom properties on the `:root` element.

```javascript
// Set a CSS variable
Paint.root.set('--primary-color', '#3498db');

// Get a CSS variable
const primaryColor = Paint.root.get('--primary-color');

// Delete a CSS variable
Paint.root.delete('--primary-color');
```

### Animation Simulation

#### `Paint.simulate(config)`

Create CSS animation simulations.

```javascript
Paint.simulate({
  selector: '.animate-element',
  pusedo: ':hover',
  times: 5,
  timeout: 500
});
```

## 💡 Usage Examples

### Dynamic Theme Switching

```javascript
// Set up a dark theme
Paint.root.set('--bg-color', '#2c3e50');
Paint.root.set('--text-color', '#ecf0f1');
Paint('body', `
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
`);
```

### Interactive Button Styles

```javascript
Paint('.btn', `
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
`)
.hover('transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2);')
.active('transform: translateY(0);')
.focus('outline: 2px solid #3498db;');
```

### Responsive Design

```javascript
// Mobile-first approach
Paint('.container', 'width: 100%; padding: 1rem;');

// Tablet styles
Paint('@media (min-width: 768px)', `
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
`);

// Desktop styles
Paint('@media (min-width: 1024px)', `
  .container {
    max-width: 1200px;
    padding: 2rem;
  }
`);
```

## 🛠️ Browser Compatibility

The engine includes automatic fallback detection for environments that don't support:
- `CSSStyleSheet` constructor
- `document.adoptedStyleSheets`

When these features are unavailable, the engine automatically creates a fallback using traditional `<style>` elements.

## ⚡ Performance Considerations

- Rules are inserted at the end of stylesheets to maintain specificity
- Minimal DOM manipulation for better performance
- Efficient selector matching using regular expressions
- Automatic cleanup and management of adopted stylesheets

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Styled Components](https://styled-components.com/) - CSS-in-JS library
- [Emotion](https://emotion.sh/) - CSS-in-JS library with great performance
- [JSS](https://cssinjs.org/) - Authoring tool for CSS

## 📚 Additional Resources

- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Can I Use - CSSStyleSheet](https://caniuse.com/mdn-api_cssstylesheet)
- [Web Components and Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

---

Made with ❤️ by the CSS Artisan Painter Engine team
