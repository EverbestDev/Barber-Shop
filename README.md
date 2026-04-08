installHook.js:1 AxiosError: Network Error
    at h.onerror (index-z65V9hRl.js:198:6115)
    at xS.request (index-z65V9hRl.js:200:1994)
    at async jS (index-z65V9hRl.js:201:6271)
    at async _.children.children.onSubmit (index-z65V9hRl.js:201:11340)
overrideMethod @ installHook.js:1Understand this error
localhost:8000/api/users/login:1  Failed to load resource: net::ERR_CONNECTION_REFUSEDUnderstand this error
installHook.js:1 AxiosError: Network Error
    at h.onerror (index-z65V9hRl.js:198:6115)
    at xS.request (index-z65V9hRl.js:200:1994)
    at async jS (index-z65V9hRl.js:201:6271)
    at async _.children.children.onSubmit (index-z65V9hRl.js:201:11340)
overrideMethod @ installHook.js:1
_.children.children.onSubmit @ index-z65V9hRl.js:201
await in _.children.children.onSubmit
wd @ index-z65V9hRl.js:8
(anonymous) @ index-z65V9hRl.js:8
fn @ index-z65V9hRl.js:8
kd @ index-z65V9hRl.js:8
hp @ index-z65V9hRl.js:9
pp @ index-z65V9hRl.js:9Understand this error
index-z65V9hRl.js:198  POST http://localhost:8000/api/users/login net::ERR_CONNECTION_REFUSED

i deplyed the baknd on render and the frontend on vercel and changed the base url and the frontulr o the prod ones

but the above was the erro code i get when i wanted to login on prod
hope its not that we have some harcoded url
there should not be any hardcoded stuff
all should point to the env