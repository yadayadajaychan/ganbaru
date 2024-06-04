username must be alphanumeric or underscore
password must be at least 8 characters

when an error occurs, an non 2xx HTTP status code is returned
along with a JSON Object with an "error" field containing
the error message

Create User
===========
- `POST /user/create`
- creates a new user
- alias is set to username
- JSON Params

 |  field   |  type  |
 |----------|--------|
 | email    | string |
 | username | string |
 | password | string |

Delete User
===========
- `POST /user/delete`
- deletes a user
- JSON Params

 |  field   |  type  |
 |----------|--------|
 | email    | string |
 | password | string |

Login
=====
- `POST /user/login`
- authenticate user
- sets `session_id` cookie
- JSON Params

 |  field   |  type  | optional |
 |----------|--------|----------|
 | email    | string | n        |
 | password | string | n        |
 | timeout  | int    | y        |

Logout
======
- `POST /user/logout`
- `session_id` cookie required

Check Session
=========================
- `GET /user/check_session`
- check if session is valid
- `session_id` cookie required

Get User Info
=============
- `GET /user/profile`
- `session_id` cookie required
- JSON Response

|   field   |  type  |   description    |
|-----------|--------|------------------|
| full_name | string | user's full name |
| alias     | string | user's alias     |

Set User Info
=============
- `POST /user/profile/set_info`
- `session_id` cookie required
- JSON Parameters

|   field   |  type  | optional |   description    |
|-----------|--------|----------|------------------|
| full_name | string | y        | user's full name |
| alias     | string | y        | user's alias     |

Create Forum
=========================
- `POST /forums/create`
- create a forum
- `session_id` cookie required
- JSON Params

 |    field    |  type  |       description        |
 |-------------|--------|--------------------------|
 | name        | string | name of the forum        |
 | description | string | description of the forum |


Get Forums (classes)
=========================
- `GET /forums`
- get a list of all the forums the user is a part of
- `session_id` cookie required
- JSON Response

 | field  |          type          |              description               |
 |--------|------------------------|----------------------------------------|
 | forums | array of forum objects | forums (classes) the user is a part of |

- Forum Objects

 | field       |   type   |         description          |
 |-------------|----------|------------------------------|
 | forum_id    | int      | forum id                     |
 | owner       | user_obj | owner of the forum           |
 | name        | string   | name of the forum            |
 | description | string   | description of the forum     |
 | important   | int      | # of unread instructor posts |
 | unread      | int      | # of unread posts            |
 | unanswered  | int      | # of unanswered questions    |

- user_obj

 | field |  type  | description  |
 |-------|--------|--------------|
 | uid   | int    | user id      |
 | name  | string | display name |

Get Posts
=========================
- `GET /forums/<forum_id>`
- get a list of posts in a subforum
- `session_id` cookie required
- Query String Params

 |   field     |   type   |         description        | optional |  default  |
 |-------------|----------|----------------------------|----------|-----------|
 | count       | int      | how many posts to fetch    | y        | 50        |
 | page        | int      | page # to fetch            | y        | 1         |
 | search      | string   | regex to search for        | y        | .*        |
 | tags        | string[] | tags to filter by          | y        | []        |
 | ascending   | bool     | ascending order            | y        | false     |
 | sortby      | string   | post_date, activity, votes | y        | post_date |

- JSON Response

 |   field    |            type            |
 |------------|----------------------------|
 | post_infos | array of post_info objects |
 | nextPage   | int                        |

- Post_info Object

 |   field             |       type       |      description      |
 |---------------------|------------------|-----------------------|
 | post_id             | int              | post id               |
 | user                | user_obj         | user who created post |
 | title               | string           | title of post         |
 | date                | string           | iso8601 timestamp     |
 | last_activity       | string           | iso8601 timestamp     |
 | views               | int              | # of views            |
 | answers             | int              | # of answers          |
 | instructor_answered | bool             | instructor answered   |
 | tags                | array of strings | tags                  |
 | score               | int              | sum of votes by users |
 | vote                | int              | user's own vote       |

- user_obj

 | field |  type  | description  |
 |-------|--------|--------------|
 | uid   | int    | user id      |
 | name  | string | display name |

Create Post
=========================
- `POST /forums/<forum_id>/create`
- create a post
- `session_id` cookie required
- JSON Parameters
- `full_text` has a 10k character limit

 |   field   |       type       |      description      | optional | default |
 |-----------|------------------|-----------------------|----------|---------|
 | title     | string           | title of the post     | n        |         |
 | full_text | string           | full text of the post | n        |         |
 | tags      | array of strings | tags                  | y        | []      |
 | anonymous | bool             | if post is anonymous  | y        | false   |
 | alias     | bool             | if post uses alias    | y        | false   |

View Post
=========================
- `GET /forums/<forum_id>/<post_id>`
- view a post
- `session_id` cookie required
- JSON Response

 |  field              |          type           |       description      |
 |---------------------|-------------------------|------------------------|
 | user                | user_obj                | user who created post  |
 | title               | string                  | title of post          |
 | date                | string                  | iso8601 timestamp      |
 | last_activity       | string                  | iso8601 timestamp      |
 | views               | int                     | # of views             |
 | answers             | int                     | # of answers           |
 | instructor_answered | bool                    | instructor answered    |
 | tags                | array of strings        | tags                   |
 | score               | int                     | sum of votes by users  |
 | vote                | int                     | user's own vote        |
 |                     |                         |                        |
 | full_text           | string                  | full text of the post  |

- user_obj

 | field |  type  | description  |
 |-------|--------|--------------|
 | uid   | int    | user id      |
 | name  | string | display name |

Get Answers
============
- `GET /forums/<forum_id>/<post_id>/answers`
- view answers for a post
- `session_id` cookie required
- Query String Params

 |   field   |  type  |        description        | optional | default |
 |-----------|--------|---------------------------|----------|---------|
 | count     | int    | how many answers to fetch | y        | 50      |
 | page      | int    | page # to fetch           | y        | 1       |
 | search    | string | regex to search for       | y        | .*      |
 | ascending | bool   | ascending order           | y        | false   |

- JSON Response

 |       field       |          type           |
 |-------------------|-------------------------|
 | instructor_answer | answer object           |
 | student_answers   | array of answer objects |
 | nextPage          | int                     |

- Answer Object

 |   field   |   type   |       description       |
 |-----------|----------|-------------------------|
 | answer_id | int      | answer id               |
 | user      | user_obj | user who answered       |
 | date      | string   | iso8601 timestamp       |
 | answer    | string   | full text of the answer |
 | score     | int      | sum of votes by users   |
 | vote      | int      | user's own vote         |

- user_obj

 | field |  type  | description  |
 |-------|--------|--------------|
 | uid   | int    | user id      |
 | name  | string | display name |

Create Answer
=============
- `POST /forums/<forum_id>/<post_id>/create`
- answer a post
- `session_id` cookie required
- JSON Parameters
- `answer` has a 10k character limit

 |   field   |  type  |      description       | optional | default |
 |-----------|--------|------------------------|----------|---------|
 | answer    | string | the text of the answer | n        |         |
 | anonymous | bool   | if post is anonymous   | y        | false   |
 | alias     | bool   | if post uses alias     | y        | false   |

Get Post Vote
=============
- `GET /forums/<forum_id>/<post_id>/get_vote`
- `session_id` cookie required
JSON Response

 |   field   |  type  |         description          |
 |-----------|--------|------------------------------|
 |    vote   |  int   | value of user vote 1, 0, -1  |

Vote on Post
============
- `POST /forums/<forum_id>/<post_id>/vote`
- vote on a post
- `session_id` cookie required
- JSON Parameters

 | field | type |      description       |
 |-------|------|------------------------|
 | vote  | int  | valid values: -1, 0, 1 |

Vote on Answer
==============
- `POST /forums/<forum_id>/<post_id>/<answer_id>/vote`
- vote on an answer
- `session_id` cookie required
- JSON Parameters

 | field | type |      description       |
 |-------|------|------------------------|
 | vote  | int  | valid values: -1, 0, 1 |

Get Join Code
=============
- `GET /forums/<forum_id>/join_code`
- get the forum's join code
- `session_id` cookie required
- JSON Response

 |   field   |  type  |         description          |
 |-----------|--------|------------------------------|
 | join_code | string | value required to join forum |

Refresh Join Code
=================
- `POST /forums/<forum_id>/refresh_join_code`
- invalidates previous join code
- requires moderator privileges
- `session_id` cookie required

Get Moderator Join Code
=======================
- `GET /forums/<forum_id>/mod_join_code`
- get the forum's moderator join code
- requires moderator privileges
- `session_id` cookie required
- JSON Response

 |     field     |  type  |                description                |
 |---------------|--------|-------------------------------------------|
 | mod_join_code | string | value required to join forum as moderator |

Refresh Moderator Join Code
===========================
- `POST /forums/<forum_id>/refresh_mod_join_code`
- invalidates previous moderator join code
- requires moderator privileges
- `session_id` cookie required

Join Forum
==========
- `POST /forums/join/<join_code>`
- join a forum using its join code
- `session_id` cookie required
