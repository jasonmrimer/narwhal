import * as AirmanCertificationModelFactory from "./AirmanCertificationModelFactory"
// @ponicode
describe("AirmanCertificationModelFactory.AirmanCertificationModelFactory.build", () => {
    test("0", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.build(987650, "bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.build("bc23a9d531064583ace8f67dad60f6bb", "a1969970175")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.build(12, 987650)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.build("a1969970175", "a1969970175")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.build(12345, "a1969970175")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.build(-Infinity, -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("AirmanCertificationModelFactory.AirmanCertificationModelFactory.buildList", () => {
    test("0", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.buildList(100, 12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.buildList(0, 56784)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.buildList(100, "a1969970175")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.buildList(0, 987650)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.buildList(-1, 56784)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            AirmanCertificationModelFactory.AirmanCertificationModelFactory.buildList(Infinity, Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})
