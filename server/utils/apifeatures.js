class apiFeatures{
    constructor(query,querystr){
        this.query = query;
        this.querystr = querystr;
    }

    search(){
        const keyword = this.querystr.keyword ? {
            name:{
                $regex:this.querystr.keyword,
                $options:"i"
            }
        } : {}
            // console.log(keyword);
        this.query = this.query.find({...keyword})
        return this;
    }

    filter(){
        const querycopy = {...this.querystr}
        //removeing field for Category
        const removeFields = ["keyword","page","Limit"]

        removeFields.forEach(key => delete querycopy[key])

        // Filter For price and Rating
            let querystr = JSON.stringify(querycopy)
            querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=> `$${key}`)
            // console.log(querystr);
        this.query = this.query.find(JSON.parse(querystr))
        return this;
    }

    // Filter per page items
    pagination(resultperpage){
        const currentpage = Number(this.querystr.page) || 1
        const skip= resultperpage* (currentpage-1)
        this.query = this.query.limit(resultperpage).skip(skip)
        return this;
    }

}


module.exports=apiFeatures