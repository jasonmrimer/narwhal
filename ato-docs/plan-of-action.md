# Plan of Action for Narwhal
## _MVP and Beyond_

**MVP Hypothesis (2017-12-4)**  
We can progressively reduce the number of trackers that a scheduler needs to review before they can schedule an Airman into a mission by making a visual planning web app that includes an airman's qualifications, availability and combines that with mission data. 

**Goals and Metrics** 
* Retire out of date tools (PEX, excel trackers, etc.)  
    * No Excel dependance for availability
    * No dependance on PEX for training data
* Provide accurate and timely data to the scheduler
    * Reduction in wasted time spent on double checking data sources
    * Reduction in wasted space spent on saving backups of data sources that commonly fail
* Eliminate manual transcription when creating an Mission Planning Sheet (MPS)
    * Decreased error rate on MPSs 
    * Decreased number of complaints due to scheduling mishaps


**The Focus**  
* The primary user for this product will be the DMS Scheduler (mission planner)
* We're focussed on achieving immediate adoption in the DCGS enterprise
  
**The Functionality**  
* Provides user with a detailed "big picture" view of the next 24 hours
* Allows planners to create sorties and match receivers to them
* Helps users navigate complexity around a large number of variables (exempli gratia: complex calculations, pairing incompatibilities, various flight times, contracts)
* Reduces time required to efficiently reflow any number of sorties due to changes
* Reduces manual processes through algorithmic automation
* Integrates with existing platform: imports receiver requests directly from MAAPTK and exports paired sorties back to MAAPTK.
* Allows leadership- and unit-friendly data to be communicated throughout the planning process (exempli gratia: (Pre-)Intends, info for Commander briefings, et cetera)

**The Functionality**
* Provides user with a detailed "big picture" view of Airmen and their qualifications
* Provides user with a detailed "big picture" view of Airmen and their availability
* Allows Airmen data (qual, cert, availability etc.) to be edited within the application
* Provides user with a overview of assigned missions
* Allows user to create and edit an MPS which is linked to a mission
* Notifies user of mission changes and MPS status changes 
  
**The Wow**  
* Easy to use; little to no training necessary
* So delightful that users will prefer it over their own tools
* So informative that schedulers check this over anything else
* So delightful that other types of users (trainers and airman) will want to use it
