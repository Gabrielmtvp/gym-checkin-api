# APP

GymPass style app.

## RF Functional Requirements

- [ ] Should be able to register;
- [ ] Should be able to authenticate;
- [ ] Should be able to get user profile logged in;
- [ ] Should be able to get the quantity of check-ins;
- [ ] The user should be able to list the check-in historic;
- [ ] The user should be able to get nearby gyms;
- [ ] The user should be abe to search a gym by name;
- [ ] The user should be able to check-in gym;
- [ ] Should be able to validate the user's check-in;
- [ ] Should be able to register a gym;

## Business Logical

- [ ] The user is not allowed to register with an existent email;
- [ ] The user cannot perform two check-ins at the same day;
- [ ] The user cannot check-in if it is far from the gym (100m);
- [ ] Validation of check-in expires in 20 minutes after created;
- [ ] Only admins can validate check-ins;
- [ ] Only admins can register new gyms;

## Non-Functional Requirements

- [ ] User's password must be encrypted;
- [ ] Application data will be persisted using PostgreSql database;
- [ ] Lists should show 20 items per page;
- [ ] User's identification will use JWT (Json Web Token);
