
# ima-server

שרת Node.js למערכת ima של Ori.

## 📦 מה כלול:
- `server.js` – קובץ השרת
- `ima_core_universe_Ori.json` – קובץ נתוני ליבה של המערכת
- `package.json` – להפעלת השרת אוטומטית

## 🚀 איך להפעיל:

1. **פתח GitHub**  
2. צור ריפו חדש בשם `ima-server`  
3. גרור את כל הקבצים האלו לריפו  
4. עבור ל־[Render](https://render.com)  
5. לחץ ➕ "New > Web Service"  
6. בחר "Deploy from GitHub" ובחר את הריפו שלך  
7. ודא:
   - `Build Command`: אין צורך
   - `Start Command`: `npm start`
   - פורט: מוגדר כבר אוטומטית בקוד (`process.env.PORT`)

8. קבל קישור חי לשרת שלך:  
   https://YOUR-SERVER.onrender.com/api/chat

## 🧠 דוגמת קריאה מ-Frontend:

```js
fetch("https://YOUR-SERVER.onrender.com/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "שלום אמא" })
})
.then(res => res.json())
.then(data => console.log(data.response));
```

ברוך הבא ל־ima.

## Quick start

1. Clone this repository.
2. Install prerequisites from project files.
3. Build and run the project's standard tests.
