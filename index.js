const path = require('path');
const fs = require("fs");

exports.run = () => {
	let config = process.argv.slice(2);
	let dir = config[0];
	let vendorPrefix = config[1];
  	let vendorType;

	dir = path.resolve(dir);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

  /*
  * Added vendorType to output the type of file in the filename
  */
	switch (vendorPrefix) {
		case "cc":
			vendorType = "component";
			break;
		case "cd":
			vendorType = "directive";
			break;
		case "cs":
			vendorType = "service";
			break;
	}
	//kebab-case
	let componentName = path.basename(dir);
	let js = getDirective(componentName, vendorPrefix, vendorType);
	let directivePath = path.join(dir, componentName + "." + vendorType + ".js");
	fs.writeFileSync(directivePath, js);
	let html = getTemplate();
	let templatePath = path.join(dir, componentName + "." + vendorType + ".html");
	fs.writeFileSync(templatePath, html);
  /*
  * Added scss file
  */
  let scss = getStyles(componentName);
  let stylePath = path.join(dir, componentName + ".scss");
	fs.writeFileSync(stylePath, scss);
	console.log(`Directive ${componentName} created`)
};

function getTemplate() {
	let html =
		`
<div class="row">
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

	</div>
</div>
`;
	return html;
}

//{{componentName}} = search-footer
//{{vendorPrefix}} = cc
function getDirective(componentName, vendorPrefix, vendorType) {

	let vendorPrefixWithDot = (typeof(vendorPrefix) !== "undefined") ? vendorPrefix + "." : "";
	vendorPrefix = (typeof(vendorPrefix) !== "undefined") ? vendorPrefix : "";



	let matchToUpper = function(x, p1) {
		return p1.toUpperCase();
	};
	let componentNameProper = componentName.replace(/\-([a-z])/g, matchToUpper).replace(/^([a-z])/, matchToUpper);

	let js =
		`import template from './${componentName}.${vendorType}.html';

export default angular.module('${vendorPrefixWithDot}${componentName}', [])
	.controller('${componentNameProper}Controller', ${componentNameProper}Controller)
	.directive('${vendorPrefix}${componentNameProper}', ${componentNameProper}Directive);

function ${componentNameProper}Directive() {
	return {
		restrict: 'E',
		scope: {},
		bindToController: {

		},
		controllerAs: '$ctrl',
		template: template,
		controller: ${componentNameProper}Controller
	};
}

function ${componentNameProper}Controller() {
	let self = this;
  self.um = {

  }
}`;
	return js;
}

function getStyles(componentName) {
  let scss =
  `.${componentName} {
    &--container {}
  }`

  return scss;
}
