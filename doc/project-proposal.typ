#align(center, text(17pt)[*Project Proposal*])

#grid(
  columns: (1fr, 1fr, 1fr, 1fr, 1fr),
  align(center)[
    Evan Aceves \
    Dis 1C
  ],
  align(center)[
    Ben Chen \
    Dis 1C
  ],
  align(center)[
    Ethan Cheng \
    Dis 1C
  ],
  align(center)[
    Edwin Jiang \
    ???
  ],
  align(center)[
    Valerie So \
    ???
  ]
)

= Brief Description
Our project, Ganbaru, is a question and answer website for students enrolled in a class, where students can ask and answer questions pertaining to the course material. For each question, there is a section for the instructor answer and a section for the student answer(s). Answers can be voted on and the top voted student answer appears at the top (directly under the instructor answer). Comments can be left under each answer. Students can also act anonymously or under a pseudonym, but instructors will be able to view their true identity. Students can also search through the previously asked questions and filter by tags, date, and user.

= Features

*Dynamic data*
- Users can see new questions and answers uploaded by other users

*Upload data from client to the back-end*
- Users can ask and answer questions which will persist to the server's file system
- Questions can be tagged to assist searching

*Search through server-side data*
- Users can search through previous questions and answers using regular expressions
- Users can filter by tags, date, and user

*Three distinct features*
+ Users can comment and vote on answers
  - Top voted student answers appear directly under the instructor answer
  - Comments are structured as a tree
+ Students can act anonymously or under a pseudonym
  - Instructors can view students' real indentities
  - Search function can also filter by pseudonym
+ Users can change their notification settings
  - Email notifications or digests
  - Users can turn on notifications for a particular question
+ Users can visit other users' profiles and see their previous non-anonymous answers