var supertest = require("supertest");
var request = require('request');
var should = require('chai').should();
const server = supertest.agent('http://localhost:8000');
const chai = require('chai')

describe('GET end point test', () => {
    it('return users', done => {
        server
            .get('/getReservationList')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if(res.body)
                    return done()
            });
    });
    it('open login page', done => {
        server
            .get('/login')
            .expect(200)
            .end((err, res) => {
                if(res.body)
                    return done()
            });
    });
    it('open reservation page', done => {
        server
            .get('/reservation')
            .expect('Content-Type', /html/)
            .expect(200)
            .end((err, res) => {
                if(res.body)
                    return done()
            });
    })
    it('get reservation list of user', done => {
        server
            .get('/info')
            .end((err, res) => {
            if (err) throw err;
                res.body[res.body.length -1].rNum.should.be.equal(res.body.length)
                done()
        });
    })
    it('get seating map', done => {
        server
            .get('/seats')
            .expect(200)
            .end((err, res) => {
                if(err) throw err;
                done()
            })
    })
    it('look up register request list', done => {
        server
            .get('/registerList')
            .expect(200)
            .end((err, res) => {
                res.body[0].should.have.property('ID')
                if(err) throw err;
                done()
            })
    })
});

describe('POST end point test', () => {
    it('Login check', done => {
        server
            .post('/loginCheck')
            .expect(200)
            .end((err, res) => {
                if(res.body)
                    return done()
            });
    });
    it('Logout check', done => {
        server
            .post('/logout')
            .expect(200)
            .end((err, res) => {
                if(res.body)
                    return done()
            });
    });
});