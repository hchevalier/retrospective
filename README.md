# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* KDS (Keep Drop Start)

* KALM (Keep Add Less More)

* DAKI (Drop Add Keep Improve)

* Starfish (Keep Start Stop Less More)

* PMI (Plus Minus Idea)

* Glad Sad Mad

* 4L (Liked Learned Lacked Longed for)

* Sailboat

* 2 truths and a lie

* Twitter

* Timeline & mood curve

* Traffic lights

* Oscar et Gérard

* Star Wars

* Day-Z

* Dixit

* Postcard

# Install and run the app

Clone the repository

    git clone https://github.com/hchevalier/retrospective.git

Then

    cd retrospective

## Install gems

    bundle install

## Install webpacker and dependencies

    yarn install

## Database initialization

    rails db:create
    rails db:setup

## Running

Execute the following commands:

    rails s

And for InactivityJob:

    bundle exec sidekiq
