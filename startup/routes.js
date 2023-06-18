const categories_Rout=require("../routers/categoryRoute")
const subCategories_Rout=require("../routers/subCategoryRoute")
const brands_Rout=require("../routers/brandRoute")
const products_Rout=require("../routers/productRoute")
const user_Route=require("../routers/userRoute")
const authRoute=require("../routers/authRoute")
const reviewRoute=require("../routers/reviewRoute")
const wishlistRoute=require("../routers/wishlistRoute")
const addressRoute=require("../routers/addressRoute")
const couponRoute=require("../routers/couponRoute")
const cartRoute=require("../routers/cartRoute")
const {orderRoute}=require("../routers/orderRoute")



const handleError=require("../middleware/error")
const ApiError=require("../utils/apiError")
//const { Product } = require("../models/productModel")

module.exports=function (app) {
/* 
    app.get("/",async(req,res)=>{
        const d=[
            {
              "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
              "slug": "fjallraven-foldsack-no.-1-backpack-fits-15-laptops",
              "quantity": 10,
              "sold": 25,
              "price": 109.95,
              "priceAfterDiscount": 100,
              "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
              "category": "61b2a9d869d54640ca3d7293",
              "imageCover": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
              "ratingsAverage": 4.3,
              "ratingsQuantity": 20
            },
            {
              "title": "Mens Casual Premium Slim Fit T-Shirts",
              "slug": "mens-casual-premium-slim-fit-t-shirts",
              "quantity": 20,
              "sold": 30,
              "price": 22.3,
              "priceAfterDiscount": 20,
              "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
              "category": "61b2a9d869d54640ca3d7293",
              "imageCover": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
              "ratingsAverage": 4.4,
              "ratingsQuantity": 23
            },
            {
              "title": "Mens Cotton Jacket",
              "slug": "mens-cotton-jacket",
              "quantity": 20,
              "sold": 75,
              "price": 55.99,
              "description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
              "category": "61b7a02868424f7846ce1d6f",
              "imageCover": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
              "ratingsAverage": 4.0,
              "ratingsQuantity": 70
            },
            {
              "title": "Mens Casual Slim Fit",
              "slug": "mens-casual-slim-fit",
              "quantity": 100,
              "sold": 101,
              "price": 15.99,
              "description": "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
              "category": "61b2a9d869d54640ca3d7293",
              "imageCover": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
              "ratingsAverage": 4.9,
              "ratingsQuantity": 98
            },
            {
              "title": "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
              "slug": "john-hardy-women's-legends-naga-gold-and-silver-dragon-station-chain-bracelet",
              "quantity": 100,
              "sold": 14,
              "price": 695,
              "description": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
              "category": "61b2a9d869d54640ca3d7293",
              "imageCover": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
              "ratingsAverage": 4.4,
              "ratingsQuantity": 12
            },
            {
              "title": "Solid Gold Petite Micropave",
              "slug": "solid-gold-petite-micropave",
              "quantity": 75,
              "sold": 69,
              "price": 168,
              "description": "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.",
              "category": "61b2a8dd4bad61f4cc4a98ea",
              "imageCover": "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
              "ratingsAverage": 3.1,
              "ratingsQuantity": 66
            },
            {
              "title": "White Gold Plated Princess",
              "slug": "white-gold-plated-princess",
              "quantity": 33,
              "sold": 99,
              "price": 9.99,
              "description": "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
              "category": "61b2a8dd4bad61f4cc4a98ea",
              "imageCover": "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
              "ratingsAverage": 2.8,
              "ratingsQuantity": 76
            },
            {
              "title": "Pierced Owl Rose Gold Plated Stainless Steel Double",
              "slug": "pierced-owl-rose-gold-plated-stainless-steel-double",
              "quantity": 90,
              "sold": 32,
              "price": 10.99,
              "description": "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
              "category": "61b2a8dd4bad61f4cc4a98ea",
              "imageCover": "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
              "ratingsAverage": 4.3,
              "ratingsQuantity": 20
            },
            {
              "title": "WD 2TB Elements Portable External Hard Drive - USB 3.0",
              "slug": "wd-2tb-elements-portable-external-hard-drive-usb-3.0",
              "quantity": 102,
              "sold": 51,
              "price": 64,
              "description": "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
              "category": "61b2a8dd4bad61f4cc4a98ea",
              "imageCover": "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
              "ratingsAverage": 4.8,
              "ratingsQuantity": 42
            },
            {
              "title": "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
              "slug": "sandisk-ssd-plus-1tb-internal-ssd-sata-iii-6-gbs",
              "quantity": 104,
              "sold": 9,
              "price": 109,
              "description": "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
              "category": "61b2a8dd4bad61f4cc4a98ea",
              "imageCover": "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
              "ratingsAverage": 1.6,
              "ratingsQuantity": 5
            }
          ]
          await Product.insertMany(d)
          res.send("end")
    }) */
    
    
    
    
    // Checkout webhook
   
    app.use("/api/categorys",categories_Rout)
    app.use("/api/subcategorys",subCategories_Rout)
    app.use("/api/brands",brands_Rout)
    app.use("/api/products",products_Rout)
    app.use("/api/users",user_Route)
    app.use("/api/auth",authRoute)
    app.use("/api/categorys/:id/subcategories",subCategories_Rout)
    app.use("/api/reviews",reviewRoute)
    app.use("/api/wishlist/",wishlistRoute)
    app.use("/api/address/",addressRoute)
    app.use("/api/coupons/",couponRoute)
    app.use("/api/cart/",cartRoute)
    app.use("/api/order/",orderRoute)



    app.all("*",(req,res,next)=>{
      return next(new ApiError(`no route found ${req.originalUrl}`,400))
    })
    app.use(handleError)
}