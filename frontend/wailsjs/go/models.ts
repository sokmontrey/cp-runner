export namespace model {
	
	export class File {
	    name: string;
	    ext: string;
	
	    static createFrom(source: any = {}) {
	        return new File(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.ext = source["ext"];
	    }
	}
	export class Language {
	    name: string;
	    extension: string;
	    commands: string[];
	
	    static createFrom(source: any = {}) {
	        return new Language(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.extension = source["extension"];
	        this.commands = source["commands"];
	    }
	}
	export class Testcase {
	    id: string;
	    input: string;
	    output: string;
	
	    static createFrom(source: any = {}) {
	        return new Testcase(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.input = source["input"];
	        this.output = source["output"];
	    }
	}
	export class TestcaseRun {
	    id: string;
	    output: string;
	    diff: string;
	
	    static createFrom(source: any = {}) {
	        return new TestcaseRun(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.output = source["output"];
	        this.diff = source["diff"];
	    }
	}

}

