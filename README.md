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
   - APIs
     - OpenWeather: I selected this one, primarily because I already had a key for it.
     I did consider several other, including DarkSKy, and Apixu.
     - Google Geocoder: OpenWeather did have some limits on its ability to find locations
     so I used the Geocoder to find more accurate latitude/longitude when getting weather conditions.
 - Database
   - Users
   - Favorites
        - MTO -> Users
 - Startup procedure
    - Requires: Symfony 4, PHP 7+, Composer, NPM, MySQL
    - Clone Repo
    - create Database in MySQL
    - Add Database info, along with Open Weather API Key, and Google Geocoder key into .env file
    - In project root, run:
      - Composer Install
      - NPM Install
      - bin/console doctrine:schema:update --force
        - To preview the command, use --dump-sql instead of --force
      - bin/console server:start to open a localhost server
      - npm run watch to compile assets
  - Deployment
    - Project also deployed to heroku
        
 - Notes
   - Getting good geocoding information, conducting fuzzy location searches, and returning multiple results
   was more challenging without subscribing to the paid weather apis that I was able to find.
   - I opted for the google maps geocoder to get lat-long coordinates to make more accurate searches to the openweather api.
   - In the favorites entity, I saved the Open Weather API Id for cities that were saved, which would cut down on the total
   number of API calls made.
   - For a second phase, I would add an table to store those city ids for easier reference and would build up a database that
  would scale and lessen the reliance on the google api over time as a potential cost savings.
   - In the second phase, I would also add 5 day forecast and weather map for the active location.
   
 
