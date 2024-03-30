// Docs: https://dbml.dbdiagram.io

Table seasons {
  id uuid [primary key]
  name varchar(100)
  description varchar(255)
  season_year varchar(5)
  season_image varchar(255)
  isActive boolean
  createdAt datetime
  createdBy varchar(100)
  updatedAt datetime
  updateddBy varchar(100)
}

Table university {
  id uuid [primary key]
  name varchar(255)
  type varchar(255)
  location varchar(255)
  website varchar(255)
  email varchar(255)
  phone varchar(255)
  isActive boolean
  createdAt datetime
  createdBy varchar(100)
  updatedAt datetime
  updateddBy varchar(100)
}

Table user {
  id uuid [primary key]
  name varchar(255)
  lastname varchar(255)
  dni varchar(20)
  email varchar(255)
  password varchar(60)
  rol varchar(255)
  birthday datetime
  user_image varchar(255)
  gender varchar(20)
  university_id uuid
  season_id uuid
  isActive boolean
  createdAt datetime
  createdBy varchar(100)
  updatedAt datetime
  updatedBy varchar(100)
}

Ref: user.university_id > university.id

Ref: user.season_id > seasons.id

// Name: ExamnsType
Table examns_type {
  id Uuid [primary key]
  name varachar(100) // [no] nullable
  description varchar(255) // [yes] nullable
  isActive bool // [no] nullable
  createdAt datetime // [no] nullable
  createdBy varchar(100) // [no] nullable
  updatedAt datetime // [yes] nullable
  updatedBy varchar(100) // [yes] nullable
}

// Name: Examns
Table examns {
  id Uuid [primary key]
  name varachar(100) // [no] nullable
  description varchar(255) // [yes] nullable
  score decimal // [yes] nullable 5 number, 2 decimal
  score_pass decimal // [yes] nullable 5 number, 2 decimal
  season_id Uuid
  examn_type_id Uuid
  isActive bool // [no] nullable
  createdAt datetime // [no] nullable
  createdBy varchar(100) // [no] nullable
  updatedAt datetime // [yes] nullable
  updatedBy varchar(100) // [yes] nullable
}

Ref: examns.season_id  > seasons.id
Ref: examns.examn_type_id > examns_type.id

// Name: Questions
Table questions {
  id Uuid [primary key]
  question varachar(255) // [no] nullable
  description varchar(255) // [yes] nullable
  /* question_type: define si la respuesta
     es input(text) o choices (radiobutton)
     INPUT | CHOICES
   */
  question_type varchar(10) // [no] nullable
  question_image varchar(255) // [yes] nullable
  question_audio varchar(255) // [yes] nullable
  points decimal // [yes] nullable
  examn_id Uuid
  isActive bool // [no] nullable
  createdAt datetime // [no] nullable
  createdBy varchar(100) // [no] nullable
  updatedAt datetime // [yes] nullable
  updatedBy varchar(100) // [yes] nullable
}

Ref: questions.examn_id  > examns.id

// Name: Answers
Table answers {
  id Uuid [primary key]
  answer varachar(255) // [no] nullable
  answer_image varchar(255) // [yes] nullable
  answer_audio varchar(255) // [yes] nullable
  correct bool // [no] nullable
  question_id Uuid
  isActive bool // [no] nullable
  createdAt datetime // [no] nullable
  createdBy varchar(100) // [no] nullable
  updatedAt datetime // [yes] nullable
  updatedBy varchar(100) // [yes] nullable
}

Ref: questions.id < answers.question_id

// Name: UserExamns
Table user_examns {
  id Uuid [primary key]
  isDone bool // [no] nullable
  isApproved bool // [no] nullable
  isCanceled bool // [no] nullable
  score decimal // [no] nullable 5 number, 2 decimal
  examn_id Uuid
  season_id Uuid
  user_id Uuid
  isActive bool // [no] nullable
  createdAt datetime // [no] nullable
  createdBy varchar(100) // [no] nullable
  updatedAt datetime // [yes] nullable
  updatedBy varchar(100) // [yes] nullable
}

Ref: user_examns.examn_id > examns.id
Ref: user_examns.user_id > user.id
Ref: user_examns.season_id > seasons.id

// Name: UserQuestions
Table user_questions {
  id Uuid [primary key]
  points decimal // [no] nullable
  /* correct bool: marcar is la respuesta del user
  fue correcta o no, es diferente de answer */
  correct bool  // [no] nullable
  user_examn_id Uuid
  question_id Uuid
  isActive bool // [no] nullable
  createdAt datetime // [no] nullable
  createdBy varchar(100) // [no] nullable
  updatedAt datetime // [yes] nullable
  updatedBy varchar(100) // [yes] nullable
}

Ref: user_questions.user_examn_id > user_examns.id
Ref: user_questions.question_id > questions.id

// Name: UserAnswers
Table user_answers {
  id Uuid [primary key]
  correct bool // [no] nullable
  user_question_id Uuid
  answer_id Uuid
  isActive bool // [no] nullable
  createdAt datetime // [no] nullable
  createdBy varchar(100) // [no] nullable
  updatedAt datetime // [yes] nullable
  updatedBy varchar(100) // [yes] nullable

}

Ref: user_answers.user_question_id > user_questions.id
Ref: user_answers.answer_id > answers.id

Table contract {
  id uuid [primary key]
  name varchar(100)
  description varchar(255)
  contract varchar(4000)
  season_id uuid
  isActive boolean
  createdAt datetime
  createdBy varchar(100)
  updatedAt datetime
  updateddBy varchar(100)
}

Ref: contract.season_id > seasons.id
Ref: Payments.user_id > user.id
Ref: Payments.season_id > seasons.id
Ref: user_contract.user_id > user.id
Ref: user_contract.contract_id > contract.id
Ref: user_contract.season_id > seasons.id

Table Payments {
  id uuid [primary key]
  name varchar(255)
  reference varchar(255) unique
  description varchar(255)
  total decimal
  imagen varchar(255)
  isApproved boolean
  isRejected boolean
  isCancel boolean
  user_id uuid
  season_id uuid
  isActive boolean
  createdAt datetime
  createdBy varchar(100)
  updatedAt datetime
  updateddBy varchar(100)
}

Table user_contract {
  id Uuid [primary key]
  user_id Uuid
  contract_id Uuid
  season_id Uuid
  contract varchar(4000)
  contract_signed varchar(4000)
  isActive bool // [no] nullable
  createdAt datetime // [no] nullable
  createdBy varchar(100) // [no] nullable
  updatedAt datetime // [yes] nullable
  updatedBy varchar(100) // [yes] nullable

}