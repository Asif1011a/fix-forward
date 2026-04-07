"""
Static list of District Legal Services Authorities (DLSAs) across India.
Source: NALSA directory — https://nalsa.gov.in
Used by the /api/dlsa endpoint to help citizens locate free legal aid near them.
"""

DLSA_LIST = [
    # Maharashtra
    {
        "district": "Mumbai",
        "state": "Maharashtra",
        "address": "District Court Complex, Fort, Mumbai – 400 001",
        "phone": "022-22620660",
        "email": "dlsamumbai@mslsa.in",
    },
    {
        "district": "Pune",
        "state": "Maharashtra",
        "address": "District Court Complex, Shivajinagar, Pune – 411 005",
        "phone": "020-25536039",
        "email": "dlsapune@mslsa.in",
    },
    {
        "district": "Nagpur",
        "state": "Maharashtra",
        "address": "District Court Building, Civil Lines, Nagpur – 440 001",
        "phone": "0712-2560028",
        "email": "dlsanagpur@mslsa.in",
    },
    # Karnataka
    {
        "district": "Bengaluru",
        "state": "Karnataka",
        "address": "City Civil Court Complex, Bengaluru – 560 009",
        "phone": "080-22210133",
        "email": "dlsa.bangalore@gmail.com",
    },
    {
        "district": "Mysuru",
        "state": "Karnataka",
        "address": "District Court Campus, Mysuru – 570 024",
        "phone": "0821-2418073",
        "email": "dlsamysore@gmail.com",
    },
    # Tamil Nadu
    {
        "district": "Chennai",
        "state": "Tamil Nadu",
        "address": "High Court Buildings, Chennai – 600 104",
        "phone": "044-25300242",
        "email": "dlsachennai@tn.gov.in",
    },
    {
        "district": "Coimbatore",
        "state": "Tamil Nadu",
        "address": "District Court Complex, Coimbatore – 641 018",
        "phone": "0422-2391513",
        "email": "dlsacbe@tn.gov.in",
    },
    {
        "district": "Madurai",
        "state": "Tamil Nadu",
        "address": "District Court, Madurai – 625 020",
        "phone": "0452-2531133",
        "email": "dlsamdurai@tn.gov.in",
    },
    # Gujarat
    {
        "district": "Ahmedabad",
        "state": "Gujarat",
        "address": "District Court Complex, Navrangpura, Ahmedabad – 380 009",
        "phone": "079-27562810",
        "email": "dlsa.amd@gujarat.gov.in",
    },
    {
        "district": "Surat",
        "state": "Gujarat",
        "address": "District Court, Athwa Lines, Surat – 395 007",
        "phone": "0261-2660260",
        "email": "dlsa.surat@gujarat.gov.in",
    },
    {
        "district": "Vadodara",
        "state": "Gujarat",
        "address": "District Court, Vadodara – 390 001",
        "phone": "0265-2415330",
        "email": "dlsa.baroda@gujarat.gov.in",
    },
    # Rajasthan
    {
        "district": "Jaipur",
        "state": "Rajasthan",
        "address": "District Court, High Court Road, Jaipur – 302 001",
        "phone": "0141-2222427",
        "email": "dlsa.jaipur@rajasthan.gov.in",
    },
    {
        "district": "Jodhpur",
        "state": "Rajasthan",
        "address": "District Court Campus, Jodhpur – 342 001",
        "phone": "0291-2543213",
        "email": "dlsa.jodhpur@rajasthan.gov.in",
    },
    {
        "district": "Udaipur",
        "state": "Rajasthan",
        "address": "District Court Complex, Udaipur – 313 001",
        "phone": "0294-2410340",
        "email": "dlsa.udaipur@rajasthan.gov.in",
    },
    # Uttar Pradesh
    {
        "district": "Lucknow",
        "state": "Uttar Pradesh",
        "address": "District Court, Kaiserbagh, Lucknow – 226 001",
        "phone": "0522-2208803",
        "email": "dlsa.lucknow@up.gov.in",
    },
    {
        "district": "Kanpur",
        "state": "Uttar Pradesh",
        "address": "District Court Campus, Civil Lines, Kanpur – 208 001",
        "phone": "0512-2311427",
        "email": "dlsa.kanpur@up.gov.in",
    },
    {
        "district": "Agra",
        "state": "Uttar Pradesh",
        "address": "District Court, Agra – 282 001",
        "phone": "0562-2466810",
        "email": "dlsa.agra@up.gov.in",
    },
    {
        "district": "Varanasi",
        "state": "Uttar Pradesh",
        "address": "District Court, Varanasi – 221 001",
        "phone": "0542-2220432",
        "email": "dlsa.varanasi@up.gov.in",
    },
    # Delhi
    {
        "district": "New Delhi",
        "state": "Delhi",
        "address": "Patiala House Courts, New Delhi – 110 001",
        "phone": "011-23387089",
        "email": "dlsa.delhi@dslsa.gov.in",
    },
    # West Bengal
    {
        "district": "Kolkata",
        "state": "West Bengal",
        "address": "Calcutta High Court Premises, Kolkata – 700 001",
        "phone": "033-22135445",
        "email": "dlsakolkata@wbslsa.gov.in",
    },
    {
        "district": "Howrah",
        "state": "West Bengal",
        "address": "District Court, Howrah – 711 101",
        "phone": "033-26386042",
        "email": "dlsahowrah@wbslsa.gov.in",
    },
    # Telangana
    {
        "district": "Hyderabad",
        "state": "Telangana",
        "address": "Nampally Court Complex, Hyderabad – 500 001",
        "phone": "040-23234069",
        "email": "dlsahyd@telangana.gov.in",
    },
    # Kerala
    {
        "district": "Thiruvananthapuram",
        "state": "Kerala",
        "address": "District Court Complex, Thiruvananthapuram – 695 001",
        "phone": "0471-2327776",
        "email": "dlsa.tvm@kerala.gov.in",
    },
    {
        "district": "Kochi",
        "state": "Kerala",
        "address": "District Court, High Court Road, Ernakulam, Kochi – 682 031",
        "phone": "0484-2362020",
        "email": "dlsa.ekm@kerala.gov.in",
    },
    # Punjab / Chandigarh
    {
        "district": "Chandigarh",
        "state": "Punjab & Haryana (UT)",
        "address": "District Courts Complex, Sector 17, Chandigarh – 160 017",
        "phone": "0172-2702750",
        "email": "dlsa.chd@nic.in",
    },
    {
        "district": "Ludhiana",
        "state": "Punjab",
        "address": "District Court, Ferozepur Road, Ludhiana – 141 001",
        "phone": "0161-2418080",
        "email": "dlsa.ludhiana@punjab.gov.in",
    },
    # Bihar
    {
        "district": "Patna",
        "state": "Bihar",
        "address": "Patna High Court Compound, Patna – 800 001",
        "phone": "0612-2220027",
        "email": "dlsa.patna@bslsa.in",
    },
    # Madhya Pradesh
    {
        "district": "Bhopal",
        "state": "Madhya Pradesh",
        "address": "District Court Complex, Bhopal – 462 001",
        "phone": "0755-2551811",
        "email": "dlsa.bhopal@mp.gov.in",
    },
    {
        "district": "Indore",
        "state": "Madhya Pradesh",
        "address": "District Court, M.G. Road, Indore – 452 001",
        "phone": "0731-2533111",
        "email": "dlsa.indore@mp.gov.in",
    },
    # Odisha
    {
        "district": "Bhubaneswar",
        "state": "Odisha",
        "address": "District Court Campus, Bhubaneswar – 751 001",
        "phone": "0674-2393004",
        "email": "dlsa.bbsr@odisha.gov.in",
    },
    # Assam
    {
        "district": "Guwahati",
        "state": "Assam",
        "address": "Gauhati High Court Campus, Guwahati – 781 001",
        "phone": "0361-2345678",
        "email": "dlsa.guwahati@assam.gov.in",
    },
]


def search_dlsa(query: str) -> list:
    """Search DLSA list by district or state name (case-insensitive)."""
    q = query.strip().lower()
    if not q:
        return DLSA_LIST[:10]
    return [
        d for d in DLSA_LIST
        if q in d["district"].lower() or q in d["state"].lower()
    ]
