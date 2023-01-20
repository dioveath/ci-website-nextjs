## Charicha Institute Official Website
Charicha Institute Official Website. Students Profiles, Blogs system, etc.

<p align="center">
	<img alt="" src="charichainstitute_test_blog.png" width="70%"/>
</p>


## User Model 
```js
{ 
        id: id,
        first_name: firstName ?? "",
        last_name: lastName ?? "",
        profile_URL: photoURL ?? DEFAULT_AVATAR_LINK,
        coverURL: "",
        address: "",
        phone_number: 0,
        phone_verified: false,
        exp_points: 0,
        hearts: 0,
        roles: {
          guest: true,
        },
        profile_visits: 0,
        courses: {},
        joinedAt: Date.now(),
	courses: [
		"courseId": "111111111111111111111111011110110001101111111111111" (1: represents present, 0: represents absent)
		"courseId": "111111111111111111111111011110110001101111111111111" (1: represents present, 0: represents absent)		
	]
}
```
