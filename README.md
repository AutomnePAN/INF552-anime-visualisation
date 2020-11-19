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

for each genre, we plot the score distribution of the scores for each year, the deeper the color is, the more animes we have in this section.
From the result, we can already make some conclusions.

-   we can have an clear impression of the numbers of each genres, and how they different period. Generally speaking, we're getting more and more animes as the time passes.
-   we can observe what range of scores animes of each genre usually get.

### Current Result

![task 3](/result/score_ditribution.PNG)

## Task III

The size of each circle is the total number of fans for each genre, the link represents the number of the co-fans of two genres;

### current result

![task 1](/result/hive_plot.PNG)
![task 2](/result/fans_number_graph.PNG)
