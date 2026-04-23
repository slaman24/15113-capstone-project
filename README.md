For my 15-113 Capstone Project, I decided to create an app for a start-up idea I had called Drip, a laundry service for college students that uses a peer-to-peer model similar to Uber and Airbnb. The app manages laundry orders between Wearers (user group who wants their laundry done) and Washers (user group who does laundry to earn profit). A Wearer places a laundry order by specifying the items they need washed, pickup date/time/location to give their items to the Washer, drop-off date/time/location to get their items back from the Washer, and any cleaning details (water temperature, additional notes, etc.). A Washer accepts pending orders placed by Wearers and updates the status of the orders they have accepted (so the order can be tracked from the Wearer's perspective). Finally, after the order has been dropped off and finalized, the Wearer and Washer both rate each other and the overall experience (Wearers and Washers accumlate reviews and an overall rating that they can see in their Profile as they continue using the app to place/accept orders).

I am most proud of the mutual review system for Wearers and Washers that I was able to implement, as well as the tracking system that Wearers can use to see the status of their order (Order Placed, Accepted, Picked Up, Washing, Dropped Off). I am also proud of the visual design of the app. I used Gemini to create a logo for Drip, and then I used the colors in the logo to create a color palette for the app which I feel goes with the brand and looks cohesive overall.

The app can be run locally by cloning the repo, running npm install, and then npx expo start.

There are no API keys/secrets to handle.

Demo Video: https://drive.google.com/file/d/1wTZ4PT8mp_cXAchTZgj9Ccpll17GY_XE/view?usp=sharing

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
