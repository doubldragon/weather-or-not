Weather-or-not

MVP
 - Build an interface that prompts a user’s location and displays the current weather info about the location. Integrate whichever weather source you feel comfortable integrating and explain why you selected that source.
 
 - The app should require a user to sign in (does not need to be a full authentication process, just ask for a username to track the user), and the user should be able to setup multiple locations to check weather. When the app updates the weather info, it should update each location. The users and their locations should be stored in a database.

 - This task can be solved in whichever language you prefer. Please use whichever language you feel best showcases your skills.

 - Commit the code to GitHub, BitBucket, or other hosted Git repository and share it with our team to review.

 Structure 
 - Login Screen
   - fosuserbundle
 - App Page
   - React components
        - Search bar
        - Main display
        - Favorites
 - Database
   - Users
   - Favorites
        - MTO -> Users
        
 - Notes
   - Getting good geocoding information, conducting fuzzy location searches, and returning multiple results
   was more challenging without subscribing to the paid weather apis that I was able to find.
   - I opted for the google maps geocoder to get lat-long coordinates to make more accurate searches to the openweather api.
   - In the favorites entity, I saved the Open Weather API Id for cities that were saved, which would cut down on the total
   number of API calls made.
   - With more time, I would add an table to store those city ids for easier reference and would build up a database that
  would scale and lessen the reliance on the google api over time.
   - with more time, I would add forecasting and weather map options to the app as well to add to its functionality
