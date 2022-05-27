//Toggle all classes
const triggers = document.getElementsByClassName("v-button-eds-c-accordion__trigger")
for (let i = 0; i < triggers.length; i++) { triggers[i].click() }

//Name + email
Liferay.ThemeDisplay.getUserName() 
Liferay.ThemeDisplay.getUserEmailAddress()

//Toast
Liferay.Util.openToast()