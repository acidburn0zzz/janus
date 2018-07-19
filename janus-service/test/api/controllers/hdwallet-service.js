var should = require('should');
var supertest = require('supertest');
var server = require('../../../app');
var guid = require("guid-typescript");

describe('controllers', function() {

  describe('hdwallet-service', function() {

    describe('POST /requestOnetimeKeys', function() {
      it('should send request for onetime keys', function(done) {
        supertest(server)
          .post('/requestOnetimeKeys')
          .send({
            'txnRef': "123456",
            'networkId': "1",
            'parties': ["Bob_comp"]
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            console.log(res.body);
            //res.body.should.eql('Hello, stranger!');
            done();
          });
      });
    });

    describe('POST /getOnetimeKeys', function() {
      it('should get onetime keys', function(done) {
        supertest(server)
          .post('/getOnetimeKeys')
          .send({
            'txnRef': "123456",
            'networkId': "1"
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            console.log(res.body);
            //res.body.should.eql('Hello, stranger!');
            done();
          });
      });
    });

    describe('POST /signTransaction', function() {
      it('should return a signed tx', function(done) {

        supertest(server)
          .post('/signTransaction')
          .send({
            'txnRef': "12345",
            'networkId': "1",
            'txn': {to:"232wew", value:100}
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            console.log(res.body);
            //res.body.should.eql('Hello, stranger!');
            done();
          });
      });

      // it('should accept a name parameter', function(done) {

      //   supertest(server)
      //     .get('/hello')
      //     .query({ name: 'Scott'})
      //     .set('Accept', 'application/json')
      //     .expect('Content-Type', /json/)
      //     .expect(200)
      //     .end(function(err, res) {
      //       should.not.exist(err);

      //       res.body.should.eql('Hello, Scott!');

      //       done();
      //     });
      // });

    });

    describe('POST /postTransaction', function() {
      it('should return a signed tx', function(done) {
        supertest(server)
          .post('/postTransaction')
          .send({
            'txnRef': "a-12345",
            'networkId': "1",
            'txn': {to:"232wew", value:100}
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            console.log(res.body);
            //res.body.should.eql('Hello, stranger!');
            done();
          });
      });
    });
  });

});
