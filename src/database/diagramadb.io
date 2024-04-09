https://dbdiagram.io/d/Xperiences-65f493a3ae072629ce2185e7

Table user_examns {
  id Uuid [primary key]
  isDone bool 
  isApproved bool 
  isDisapproved bool 
  isCanceled bool 
  score decimal
  examn_id Uuid
  season_id varchar(30)
  user_id Uuid
  isActive bool 
  createdAt datetime 
  createdBy varchar(100) 
  updatedAt datetime 
  updatedBy varchar(100) 
}

Table user_contract {
  id Uuid [primary key]
  user_id Uuid
  contract_id Uuid
  season_id varchar(30)
  contract varchar(4000)
  contract_signed varchar(4000)
  isActive bool 
  createdAt datetime 
  createdBy varchar(100) 
  updatedAt datetime 
  updatedBy varchar(100) 
}

Table user {
  id uuid [primary key]
  name varchar(255)
  lastname varchar(255)
  dni varchar(20)
  email varchar(255)
  password varchar(60)
  rol varchar(30)
  birthday varchar(100)
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

Table schedule {
  id Uuid [primary key]
  TimeRangeInit datetime
  TimeRangeEnd datetime
  day varchar(20)
  isActive bool 
  createdAt datetime 
  createdBy varchar(100) 
  updatedAt datetime 
  updatedBy varchar(100) 
}

Table Payments {
  id uuid [primary key]
  name varchar(255)
  reference varchar(50) unique
  concept varchar(20)
  description varchar(255)
  total decimal
  imagen varchar(255)
  isApproved varchar(20)
  isRejected varchar(20)
  isCancel varchar(20)
  user_id uuid
  season_id varchar(30)
  isActive boolean
  createdAt datetime
  createdBy varchar(100)
  updatedAt datetime
  updateddBy varchar(100)
}

Table examns_type {
  id Uuid [primary key]
  name varchar(100)
  description varchar(255) 
  isActive bool 
  createdAt datetime 
  createdBy varchar(100) 
  updatedAt datetime 
  updatedBy varchar(100) 
}

Table examns {
  id Uuid [primary key]
  name varachar(100) 
  description varchar(255) 
  score decimal 
  score_pass decimal 
  season_id varchar(30)
  examn_type_id Uuid
  isActive bool 
  createdAt datetime 
  createdBy varchar(100) 
  updatedAt datetime 
  updatedBy varchar(100)
}

Table contract {
  id uuid [primary key]
  name varchar(100)
  description varchar(255)
  contract varchar(4000)
  season_id varchar(30)
  isActive boolean
  createdAt datetime
  createdBy varchar(100)
  updatedAt datetime
  updateddBy varchar(100)
}

Table appointment {
  id uuid [primary key]
  schedule_id Uuid
  user_id Uuid
  scheduleDate datetime
  isActive bool 
  createdAt datetime 
  createdBy varchar(100) 
  updatedAt datetime 
  updatedBy varchar(100) 
}

Ref: user.university_id > university.id
Ref: user.season_id > seasons.id
Ref: examns.examn_type_id > examns_type.id
Ref: user_examns.examn_id > examns.id
Ref: user_examns.user_id > user.id
Ref: Payments.user_id > user.id
Ref: user_contract.user_id > user.id
Ref: user_contract.contract_id > contract.id
Ref: appointment.schedule_id > schedule.id
Ref: appointment.user_id > user.id