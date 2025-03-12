# ext-linkedIn-click

"StopLostPanel.js"
The code provided is a JavaScript file called "StopLostPanel.js" that defines a class named "StopLostPanel". This class contains various static methods and properties related to creating and manipulating a configuration panel. Here is a summary of the key features of the code:
The class has a static property called "appendToEl" that references the body element of the HTML document.
There are static methods for creating a console box, rendering rows with checkboxes, creating an apply button, and creating a checkbox row.
The code includes event listeners for changing the background color of the apply button when a checkbox is changed.
The "cfgViewTab" method builds a tab container with checkboxes for different options and an apply button.
The class also includes methods for creating HTML elements, setting the configuration, and creating buttons.
Overall, the code is used to create a configuration panel with checkboxes and an apply button for managing certain settings or options.


ClickActionState.timeOuts - saugo sukurtus CustomTimeout objektus pagal konfiguracijos raktą.
Objekto paskirtis suvaldyti kad CustomTimeout pasileidimo seka butu nuosekli. Kad CustomTimeout pasileistu tik
puslapije kur gali veikti. Pasikeitus puslapiui yra išvalomas. SiteNavigation.changePath kviečia metodą clickActionState.resetTimeOuts(); kuris išvalo objektą.

StopLostState.timeOuts - saugo sukurtus CustomTimeout objektus, masyve.
SiteNavigation.changePath kviečia metodą cfgState.reset(); kuris išvalo objektą.