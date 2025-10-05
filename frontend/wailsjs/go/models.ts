export namespace model {
	
	export class DiffChangedEvent {
	    fileName: string;
	    id: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new DiffChangedEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fileName = source["fileName"];
	        this.id = source["id"];
	        this.value = source["value"];
	    }
	}
	export class File {
	    fullName: string;
	    name: string;
	    ext: string;
	
	    static createFrom(source: any = {}) {
	        return new File(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fullName = source["fullName"];
	        this.name = source["name"];
	        this.ext = source["ext"];
	    }
	}
	export class Language {
	    name: string;
	    extension: string;
	    command: string;
	
	    static createFrom(source: any = {}) {
	        return new Language(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.extension = source["extension"];
	        this.command = source["command"];
	    }
	}
	export class OutputChangedEvent {
	    fileName: string;
	    id: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new OutputChangedEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fileName = source["fileName"];
	        this.id = source["id"];
	        this.value = source["value"];
	    }
	}
	export class Testcase {
	    id: string;
	    input: string;
	    expectedOutput: string;
	    actualOutput: string;
	    diff: string;
	
	    static createFrom(source: any = {}) {
	        return new Testcase(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.input = source["input"];
	        this.expectedOutput = source["expectedOutput"];
	        this.actualOutput = source["actualOutput"];
	        this.diff = source["diff"];
	    }
	}

}

