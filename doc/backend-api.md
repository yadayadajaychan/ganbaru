username must be alphanumeric or underscore
password must be at least 8 characters

when an error occurs, an non 2xx HTTP status code is returned
along with a JSON Object with an "error" field containing
the error message


Create User
=========================
- `POST /user/create`
- creates a new user
- JSON Params

    field   |  type
  ----------|--------
   username | string
   password | string


Delete User
=========================
- `POST /user/delete`
- deletes a user
- JSON Params

    field   |  type
  ----------|--------
   username | string
   password | string


Login
=========================
- `POST /user/login`
- authenticate user
- sets `session_id` cookie
- JSON Params

    field   |  type  | optional
  ----------|--------|----------
   username | string | n
   password | string | n
   timeout  | int    | y


Logout
=========================
- `POST /user/logout`
- `session_id` cookie required


Check Session
=========================
- `GET /user/check_session`
- check if session is valid
- `session_id` cookie required


Create Forum
=========================
- `POST /forums/create`
- create a forum
- `session_id` cookie required
- JSON Params

     field    |  type  |       description         
 -------------|--------|-------------------------- 
  name        | string | name of the forum         
  description | string | description of the forum  


Get Forums (classes)
=========================
- `GET /forums`
- get a list of all the forums the user is a part of
- `session_id` cookie required
- JSON Response

   field  |          type          |              description
  --------|------------------------|----------------------------------------
   forums | array of forum objects | forums (classes) the user is a part of

- Forum Objects

   field       |  type  |         description
  -------------|--------|------------------------------
   forum_id    | int    | forum id
   owner       | string | owner of the forum
   name        | string | name of the forum
   description | string | description of the forum
   important   | int    | # of unread instructor posts
   unread      | int    | # of unread posts
   unanswered  | int    | # of unanswered questions


Create Subforum
=========================
- `POST /forums/<forum_id>/create`
- `session_id` cookie required
- JSON Parameters

     field    |  type  |       description        | optional  
 -------------|--------|--------------------------|---------- 
  category    | string | category of the subforum | n         
  name        | string | name of the subforum     | n         
  description | string | description              | y         


Get Subforums
=========================
- `GET /forums/<forum_id>`
- get a list of all the subforums in a forum
- `session_id` cookie required

- JSON Response

     field    |           type            |          description
  ------------|---------------------------|--------------------------------
   categories | array of category objects | each subforum is in a category

- Category Object

     field   |           type            |           description
  -----------|---------------------------|---------------------------------
   name      | string                    | name of category
   subforums | array of subforum objects | list of subforums in a category

- Subforum Objects

    field      |  type  |         description
  -------------|--------|------------------------------
   subforum_id | int    | subforum id
   name        | string | name of the subforum
   description | string | description of the subforum
   important   | int    | # of unread instructor posts
   unread      | int    | # of unread posts
   unanswered  | int    | # of unanswered questions

- E.g.
  ```
  {"categories": [{"name": CATEGORY_NAME, "subforums": [SUBFORUM_OBJ, SUBFORUM_OBJ, ...]},
                  {"name": CATEGORY_NAME, "subforums": [SUBFORUM_OBJ, SUBFORUM_OBJ, ...]},
                  ...
                  ]}
  ```

Get Posts
=========================
- `GET /forums/<forum_id>/<subforum_id>`
- get a list of posts in a subforum
- `session_id` cookie required
- Query String Params

     field     |  type  |         description        | optional |  default
  -------------|--------|----------------------------|----------|-----------
   count       | int    | how many posts to fetch    | y        | 50
   page        | int    | page # to fetch            | y        | 1
   ascending   | bool   | ascending order            | y        | false
   sortby      | string | post date, activity, votes | y        | post date

- JSON Response

     field    |            type
  ------------|----------------------------
   post_infos | array of post_info objects

- Post_info Object

     field             |       type       |      description
  ---------------------|------------------|-----------------------
   subforum_id         | int              | subforum id
   post_id             | int              | post id
   user_id             | int              | user who created post
   title               | string           | title of post
   date                | string           | iso8601 timestamp
   views               | int              | # of views
   answers             | int              | # of answers
   instructor_answered | bool             | instructor answered
   tags                | array of strings | tags


Create Post
=========================
- `POST /forums/<forum_id>/<subforum_id>/create`
- create a post
- `session_id` cookie required
- JSON Parameters

    field   |       type       |      description      | optional
 -----------|------------------|-----------------------|----------
  title     | string           | title of the post     | n
  full_text | string           | full text of the post | n
  tags      | array of strings | tags                  | y


View Post
=========================
- `GET /forums/<forum_id>/<subforum_id>/<post_id>`
- view a post
- `session_id` cookie required
- JSON Response

    field              |          type           |       description
  ---------------------|-------------------------|------------------------
   user_id             | int                     | user who created post
   title               | string                  | title of post
   date                | string                  | iso8601 timestamp
   views               | int                     | # of views
   answers             | int                     | # of answers
   instructor_answered | bool                    | instructor answered
   tags                | array of strings        | tags
                       |                         |
   full_text           | string                  | full text of the post
   instructor_answer   | answer object           |
   student_answers     | array of answer objects |

- Answer Object

     field   |  type  |       description
  -----------|--------|-------------------------
   answer_id | int    | answer id
   user_id   | int    | user who answered
   date      | string | iso8601 timestamp
   answer    | string | full text of the answer
   score     | int    | sum of votes by users


Search Posts
=========================
- `GET /forums/<forum_id>/search`
