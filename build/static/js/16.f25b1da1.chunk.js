(this["webpackJsonpstarter-bt5"]=this["webpackJsonpstarter-bt5"]||[]).push([[16],{143:function(t,e,c){"use strict";var n=c(38),a=c(39),r=c(2),s=c.n(r),i=c(1),o=c(42),l=c(4),d=["bsPrefix","variant","animation","size","as","className"],j=i.forwardRef((function(t,e){var c=t.bsPrefix,r=t.variant,i=t.animation,j=void 0===i?"border":i,b=t.size,u=t.as,h=void 0===u?"div":u,O=t.className,f=Object(a.a)(t,d);c=Object(o.c)(c,"spinner");var m="".concat(c,"-").concat(j);return Object(l.jsx)(h,Object(n.a)(Object(n.a)({ref:e},f),{},{className:s()(O,m,b&&"".concat(m,"-").concat(b),r&&"text-".concat(r))}))}));j.displayName="Spinner",e.a=j},283:function(t,e,c){"use strict";c.r(e);var n=c(8),a=c(1),r=c(90),s=c(143),i=c(13),o=c(84),l=c(289),d=c(4);e.default=function(){var t=Object(a.useState)([]),e=Object(n.a)(t,2),c=(e[0],e[1],Object(a.useState)(!0)),j=Object(n.a)(c,2),b=j[0],u=j[1],h=Object(a.useState)(),O=Object(n.a)(h,2),f=O[0],m=O[1],x=Object(a.useState)(1),g=Object(n.a)(x,2),p=g[0],v=g[1],N=Object(a.useState)([]),w=Object(n.a)(N,2),y=w[0],S=w[1];Object(a.useEffect)((function(){Object(o.c)(p).then((function(t){console.log(t);var e=t.data.data;S(e),u(!1),m(t.data.totalCount)})).catch((function(t){console.log(t),u(!1)}))}),[p]);return Object(d.jsx)(i.F,{children:Object(d.jsx)(i.n,{children:Object(d.jsxs)(i.g,{className:"mt-5",children:[Object(d.jsxs)(i.m,{tag:"h6",className:"border-bottom p-3 mb-0",children:[Object(d.jsx)("i",{className:"bi bi-bell me-2",children:" "}),"Users List"]}),b&&Object(d.jsx)(s.a,{style:{margin:"5px auto"},animation:"border",variant:"primary"}),Object(d.jsxs)(i.h,{children:[Object(d.jsxs)(r.a,{striped:!0,bordered:!0,hover:!0,responsive:!0,children:[Object(d.jsx)("thead",{children:Object(d.jsxs)("tr",{children:[Object(d.jsx)("th",{className:"font-weight-bold",children:"#"}),Object(d.jsx)("th",{className:"font-weight-bold",children:"FirstName"}),Object(d.jsx)("th",{className:"font-weight-bold",children:"LastName"}),Object(d.jsx)("th",{className:"font-weight-bold",children:"Email Id"}),Object(d.jsx)("th",{className:"font-weight-bold",children:"Phone No"}),Object(d.jsx)("th",{className:"font-weight-bold",children:"isApproved"})]})}),Object(d.jsxs)("tbody",{children:[console.log("listData",y),(null===y||void 0===y?void 0:y.length)>=1?y.map((function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Object(d.jsxs)("tr",{children:[Object(d.jsx)("td",{children:e+1}),Object(d.jsx)("td",{children:t.firstName}),Object(d.jsx)("td",{children:t.lastName}),Object(d.jsx)("td",{children:t.email}),Object(d.jsx)("td",{children:t.phoneNo}),Object(d.jsx)("td",{children:t.isApproved})]},t._id)})):Object(d.jsx)("tr",{children:Object(d.jsx)("td",{colSpan:14,style:{textAlign:"center"},children:Object(d.jsx)("strong",{children:"No Users available"})})})]})]}),console.log("totalcount",f),Object(d.jsx)(l.a,{onChange:function(t){v(t)},defaultCurrent:p,total:f})]})]})})})}},84:function(t,e,c){"use strict";c.d(e,"c",(function(){return s})),c.d(e,"a",(function(){return i})),c.d(e,"b",(function(){return o})),c.d(e,"d",(function(){return l}));var n=c(290),a={Url:"http://13.127.124.169/"};function r(){var t=localStorage.getItem("token");return console.log("token",t),n.a.create({baseURL:a.Url,headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(t)}})}function s(t){return r().get("dev_formulaw/user/getusers/?page=".concat(t,"&limit=10"))}function i(t){return console.log("payload :",t),r().post("dev_formulaw/admin/login",JSON.stringify(t))}function o(t){return r().get("dev_formulaw/lawyer/getLawyers/?page=".concat(t,"&limit=10"))}function l(t){return r().put("/dev_formulaw/lawyer/updateStatus",JSON.stringify(t))}}}]);
//# sourceMappingURL=16.f25b1da1.chunk.js.map