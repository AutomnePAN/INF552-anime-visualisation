# INF552-anime-visualisation

The project of course INF552 of Polytechnique,

During this project of data visualisation we want to work with some of the datasets in https://lionbridge.ai/datasets/top-25-anime-manga-and-video-game-datasets/.

We will principally be working on this data set https://www.kaggle.com/canggih/anime-data-score-staff-synopsis-and-genre?select=dataanime.csv,
to study and present the relations between the popularities, scores, and other features, like the genres, the ranking, the staffs, etc.  
If possible, we will also use some information given by the other data sets in the link, for example, the specific score from each user, to study how different genre of animes gain their popularities in different types of audiences.

## Task I

Here we want to visualize the dataset as a network embedding. We are thinking to use a hive plot to do the visualization. The axis we choose are

-   genre & source
-   starting_season & studio
-   score & favorite / score_by

organized in there groups. Then we would like to add some filters to highlight part of the graph.

Further animation or interaction may be added, such as edge bundling.

## Task II

Plot the favorites number and average scores of each genre by year

### Current Result

![task 2](/result/genre_2000.PNG)
## Task III

for each genre, plot the score distribution of the scores for each year
add fansy header

### Current Result

![task 3](/result/score_ditribution.PNG)
