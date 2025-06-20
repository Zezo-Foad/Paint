"use strict";
window.CSSInsertEngine = new CSSStyleSheet();
window.CSSEngine = document.styleSheets;
/*
window.CSSStyleSheet = undefined;
document.adoptedStyleSheet = undefined;
*/
// fallout simulation 👆
if (typeof window.CSSStyleSheet !== "function" || typeof document.adoptedStyleSheets !== "object") {
  const style = document.createElement("style");
  style.id="Paint-Emergency-CSSEngine";  
  document.head.appendChild(style);
  window.CSSInsertEngine = style.sheet;
  console.log(`Backup engine is Running....`);
}

function Paint(selector,cssText) {
	
var insertOne = function (CSSCode) {
CSSInsertEngine.insertRule(CSSCode,CSSInsertEngine.length);
document.adoptedStyleSheets=[...document.adoptedStyleSheets,CSSInsertEngine];
	};
	
const CSSCode = `${selector}{
  ${cssText}
}`;

insertOne(CSSCode);
	return new Proxy({}, {  
    get(_, pseudoClass) {  
      return (...styles) => {  
        if(pseudoClass){
        	const CSSCode = `${selector}:${pseudoClass}{
  ${pseudoClass,styles}
}`;
        	insertOne(CSSCode);
        }
      };  
    }  
  });
}
Paint.getCSSObj = function (selector, options = {}) {
	const {
		multiple = false,
		pusedo // true | false | "only"
	} = options;

	const regex = new RegExp(selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "g");
	let results = [];

	for (const CSSs of CSSEngine) {
		for (const Rules of CSSs.cssRules) {
			if (!Rules.selectorText) continue;

			const selText = Rules.selectorText;
			const hasPseudo = selText.includes(":");
			const matches = regex.test(selText);

			if (!matches) continue;

			// فلترة حسب الـ pusedo
			if (pusedo === "only" && !hasPseudo) continue;
			if (pusedo === false && hasPseudo) continue;

			if (!multiple) return Rules.style;
			results.push(Rules);
		}
	}

	return multiple ? results : `Theres no matches for "${selector}" !`;
};
Paint.getCSS = function (selector, options = {}) {
	const {
		multiple = false,
		pusedo // true | false | "only"
	} = options;

	const regex = new RegExp(selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "g");
	let results = [];

	for (const CSSs of CSSEngine) {
		for (const Rules of CSSs.cssRules) {
			if (!Rules.selectorText) continue;

			const selText = Rules.selectorText;
			const hasPseudo = selText.includes(":");
			const matches = regex.test(selText);

			if (!matches) continue;

			if (pusedo === "only" && !hasPseudo) continue;
			if (pusedo === false && hasPseudo) continue;

			if (!multiple) return Rules.style.cssText;
			results.push(Rules.style.cssText);
		}
	}

	return multiple ? results : {
		error:`Theres no matches for "${selector}" !`
	};
};
Paint.simulate = function (obj) {
window.Fut = Paint.getCSSObj(obj.selector + obj.pusedo).cssText;
window.Prev = Paint.getCSSObj(obj.selector).cssText;

  function Repeat(t, tout) {
  for (let i = 0; i < t; i++) {
    setTimeout(() => {
      Paint.getCSSObj(obj.selector).cssText+=Fut;
    }, i * tout * 2); // Apply pseudo

    setTimeout(() => {
    	Paint.getCSSObj(obj.selector).cssText-=Fut;
      Paint.getCSSObj(obj.selector).cssText=Prev;
    }, i * tout * 2 + tout); // Revert
  }
}
  Repeat(obj.times, obj.timeout);
};
Paint.root = {
  set: function (variable, value) {
    return Paint.getCSSObj(":root").setProperty(variable, value);
  },
  get: function (variable) {
    return Paint.getCSSObj(":root").getPropertyValue(variable);
  },
  delete: function (variable) {
  	Paint.getCSSObj(":root").removeProperty(variable);
  }
};
// By Zyad & GPT 🫂