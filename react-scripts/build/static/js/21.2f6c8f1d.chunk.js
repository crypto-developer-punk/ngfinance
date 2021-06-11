(this["webpackJsonpthefront-js--react-scripts"]=this["webpackJsonpthefront-js--react-scripts"]||[]).push([[21],{1398:function(e,t,o){"use strict";o.r(t),o.d(t,"default",(function(){return m}));var n=o(2),r=o(0),i=(o(1),o(1357)),a=o(1320),s=o(323),c=o(4),d=o(10),p=o(5),l=[{name:"leftSide",type:"node",default:"",description:"Children to placed inside the section left side"},{name:"rightSide",type:"node",default:"",description:"Children to placed inside the section right side"},{name:"className",type:"string",default:"",description:"External classes"}],m=function(e){var t=Object.assign({},e);return Object(r.jsxs)("div",Object(n.a)(Object(n.a)({},t),{},{children:[Object(r.jsx)(s.e,{title:"Description",gutterBottom:!0,children:Object(r.jsx)(s.b,{title:"HeroShaped",path:"src/components/organisms/HeroShaped/HeroShaped.js",description:"Component to display the background hero"})}),Object(r.jsx)(s.e,{title:"Import",gutterBottom:!0,children:Object(r.jsx)(s.a,{code:"\nimport { HeroShaped } from 'components/organisms';\n// or\nimport HeroShaped from 'components/organisms/HeroShaped';\n"})}),Object(r.jsx)(s.e,{title:"Props & Methods",gutterBottom:!0,children:Object(r.jsx)(s.d,{dataProperties:l})}),Object(r.jsx)(s.e,{title:"Basic Example",gutterBottom:!0,children:Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)(i.a,{marginBottom:2,padding:2,border:"1px solid #ccc",borderRadius:"4px",children:Object(r.jsx)(c.p,{leftSide:Object(r.jsx)(p.e,{title:"Coworking made easy",subtitle:"For entrepreneurs, startups and freelancers. Discover coworking spaces designed to inspire and to connect you to a community of motivated people.",ctaGroup:[Object(r.jsx)(a.a,{variant:"contained",color:"primary",children:"Book"}),Object(r.jsx)(a.a,{variant:"outlined",color:"primary",children:"Browse"})],align:"left"}),rightSide:Object(r.jsx)(d.d,{src:"https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg",alt:"...",style:{objectFit:"cover"},lazy:!1})})}),Object(r.jsx)(s.a,{code:'\nimport React from \'react\';\nimport { Box, Button } from \'@material-ui/core\';\nimport { HeroShaped } from \'components/organisms\';\nimport { Image } from \'components/atoms\';\nimport { SectionHeader } from \'components/molecules\';\n\nexport default function Example() {\n  return (\n    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">\n      <HeroShaped\n        leftSide={(\n          <SectionHeader\n            title="Coworking made easy"\n            subtitle="For entrepreneurs, startups and freelancers. Discover coworking spaces designed to inspire and to connect you to a community of motivated people."\n            ctaGroup={[\n              <Button variant="contained" color="primary">Book</Button>,\n              <Button variant="outlined" color="primary">Browse</Button>\n            ]}\n            align="left"\n          />\n        )}\n        rightSide={(\n          <Image src="https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg" alt="..." style={{ objectFit: \'cover\' }} lazy={false} />\n        )}\n      />\n    </Box>\n  );\n}\n'})]})})]}))}}}]);