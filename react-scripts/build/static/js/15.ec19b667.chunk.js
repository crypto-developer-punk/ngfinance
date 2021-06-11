(this["webpackJsonpthefront-js--react-scripts"]=this["webpackJsonpthefront-js--react-scripts"]||[]).push([[15],{1395:function(e,t,o){"use strict";o.r(t),o.d(t,"default",(function(){return p}));var a=o(2),r=o(0),n=(o(1),o(1357)),i=o(6),s=o(323),c=o(4),d=o(5),m=[{name:"authorName",type:"string",default:"",description:"Reviewer name to show inside the review card"},{name:"authorPhoto",type:"object",default:"",description:"Reviewer photo to show inside the review card.Should be an object with src and srcSet properties"},{name:"icon",type:"node",default:"",description:"Icon to show inside the review card"},{name:"text",type:"string",default:"",description:"Review text to show inside the review card"},{name:"align",type:"enum",default:"center",description:"Alignment of the content. One of: left, right, center"},{name:"authorTitle",type:"string",default:"",description:"Reviewer title to show inside the review card"},{name:"listItemPrimaryTypographyProps",type:"object",default:"",description:"Additional props to pass to the list item primary text Typography component"},{name:"listItemSecondaryTypographyProps",type:"object",default:"",description:"Additional props to pass to the list item secondary text Typography component"},{name:"textProps",type:"object",default:"",description:"Additional props to pass to the text Typography component"},{name:"textVariant",type:"string",default:"h6",description:"Review text variant"},{name:"className",type:"string",default:"",description:"External classes"}],p=function(e){var t=Object.assign({},e);return Object(r.jsxs)("div",Object(a.a)(Object(a.a)({},t),{},{children:[Object(r.jsx)(s.e,{title:"Description",gutterBottom:!0,children:Object(r.jsx)(s.b,{title:"CardReview",path:"src/components/organisms/CardReview/CardReview.js",description:"Component to display the review card"})}),Object(r.jsx)(s.e,{title:"Import",gutterBottom:!0,children:Object(r.jsx)(s.a,{code:"\nimport { CardReview } from 'components/organisms';\n// or\nimport CardReview from 'components/organisms/CardReview';\n"})}),Object(r.jsx)(s.e,{title:"Props & Methods",gutterBottom:!0,children:Object(r.jsx)(s.d,{dataProperties:m})}),Object(r.jsx)(s.e,{title:"Basic Example",gutterBottom:!0,children:Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)(n.a,{marginBottom:2,padding:2,border:"1px solid #ccc",borderRadius:"4px",children:Object(r.jsx)(c.l,{icon:Object(r.jsx)(d.c,{fontIconClass:"fas fa-quote-right",size:"medium",color:i.a.indigo}),text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",authorName:"Veronica Adams",authorTitle:"Growth Marketer, Crealytics",authorPhoto:{src:"https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg",srcSet:"https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x"}})}),Object(r.jsx)(s.a,{code:'\nimport React from \'react\';\nimport { Box, colors } from \'@material-ui/core\';\nimport { CardReview } from \'components/organisms\';\nimport { IconAlternate } from "components/molecules";\n\nexport default function Example() {\n  return (\n    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">\n      <CardReview\n        icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}\n        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."\n        authorName="Veronica Adams"\n        authorTitle="Growth Marketer, Crealytics"\n        authorPhoto={{ src: \'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg\', srcSet: \'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x\' }}\n      />\n    </Box>\n  );\n}\n'})]})}),Object(r.jsx)(s.e,{title:"Custom Shadow Example",gutterBottom:!0,children:Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)(n.a,{marginBottom:2,padding:2,border:"1px solid #ccc",borderRadius:"4px",children:Object(r.jsx)(c.l,{withShadow:!0,icon:Object(r.jsx)(d.c,{fontIconClass:"fas fa-quote-right",size:"medium",color:i.a.indigo}),text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",authorName:"Veronica Adams",authorTitle:"Growth Marketer, Crealytics",authorPhoto:{src:"https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg",srcSet:"https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x"}})}),Object(r.jsx)(s.a,{code:'\nimport React from \'react\';\nimport { Box, colors } from \'@material-ui/core\';\nimport { CardReview } from \'components/organisms\';\nimport { IconAlternate } from "components/molecules";\n\nexport default function Example() {\n  return (\n    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">\n      <CardReview\n        withShadow\n        icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}\n        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."\n        authorName="Veronica Adams"\n        authorTitle="Growth Marketer, Crealytics"\n        authorPhoto={{ src: \'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg\', srcSet: \'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x\' }}\n      />\n    </Box>\n  );\n}\n'})]})}),Object(r.jsx)(s.e,{title:"LiftUp Effect Example",gutterBottom:!0,children:Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)(n.a,{marginBottom:2,padding:2,border:"1px solid #ccc",borderRadius:"4px",children:Object(r.jsx)(c.l,{liftUp:!0,withShadow:!0,icon:Object(r.jsx)(d.c,{fontIconClass:"fas fa-quote-right",size:"medium",color:i.a.indigo}),text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",authorName:"Veronica Adams",authorTitle:"Growth Marketer, Crealytics",authorPhoto:{src:"https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg",srcSet:"https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x"}})}),Object(r.jsx)(s.a,{code:'\nimport React from \'react\';\nimport { Box, colors } from \'@material-ui/core\';\nimport { CardReview } from \'components/organisms\';\nimport { IconAlternate } from "components/molecules";\n\nexport default function Example() {\n  return (\n    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">\n      <CardReview\n        liftUp\n        withShadow\n        icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}\n        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."\n        authorName="Veronica Adams"\n        authorTitle="Growth Marketer, Crealytics"\n        authorPhoto={{ src: \'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg\', srcSet: \'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x\' }}\n      />\n    </Box>\n  );\n}\n'})]})}),Object(r.jsx)(s.e,{title:"Basic Card with No Border and No Shadow Example",gutterBottom:!0,children:Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)(n.a,{marginBottom:2,padding:2,border:"1px solid #ccc",borderRadius:"4px",children:Object(r.jsx)(c.l,{noBorder:!0,noShadow:!0,icon:Object(r.jsx)(d.c,{fontIconClass:"fas fa-quote-right",size:"medium",color:i.a.indigo}),text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",authorName:"Veronica Adams",authorTitle:"Growth Marketer, Crealytics",authorPhoto:{src:"https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg",srcSet:"https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x"}})}),Object(r.jsx)(s.a,{code:'\nimport React from \'react\';\nimport { Box, colors } from \'@material-ui/core\';\nimport { CardReview } from \'components/organisms\';\nimport { IconAlternate } from "components/molecules";\n\nexport default function Example() {\n  return (\n    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">\n      <CardReview\n        noBorder\n        noShadow\n        icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}\n        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."\n        authorName="Veronica Adams"\n        authorTitle="Growth Marketer, Crealytics"\n        authorPhoto={{ src: \'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg\', srcSet: \'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x\' }}\n      />\n    </Box>\n  );\n}\n'})]})}),Object(r.jsx)(s.e,{title:"Basic Card with Outlined Effect",gutterBottom:!0,children:Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)(n.a,{marginBottom:2,padding:2,border:"1px solid #ccc",borderRadius:"4px",children:Object(r.jsx)(c.l,{variant:"outlined",icon:Object(r.jsx)(d.c,{fontIconClass:"fas fa-quote-right",size:"medium",color:i.a.indigo}),text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",authorName:"Veronica Adams",authorTitle:"Growth Marketer, Crealytics",authorPhoto:{src:"https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg",srcSet:"https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x"}})}),Object(r.jsx)(s.a,{code:'\nimport React from \'react\';\nimport { Box, colors } from \'@material-ui/core\';\nimport { CardReview } from \'components/organisms\';\nimport { IconAlternate } from "components/molecules";\n\nexport default function Example() {\n  return (\n    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">\n      <CardReview\n        variant="outlined"\n        icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}\n        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."\n        authorName="Veronica Adams"\n        authorTitle="Growth Marketer, Crealytics"\n        authorPhoto={{ src: \'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg\', srcSet: \'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x\' }}\n      />\n    </Box>\n  );\n}\n'})]})})]}))}}}]);