#!/data/data/com.termux/files/usr/bin/bash
# Step 2 of the real-footage pass: download the shortlisted Creative Commons videos (picture only, up to 1080p) with
# their metadata (the .info.json carries YouTube's own licence line, checked again before any clip is used) and upload
# them to Drive Telugu/Medigadda/footage/raw/. The rclone remote on the owner's phone is rooted at Creator/.
R=$(rclone listremotes | head -1); D=$HOME/medigadda_footage/raw; mkdir -p "$D"; cd "$D"
for id in ucvwS7_agjc InH2Y1DQB-w NYQbErMVkCU aEaW_vrhh7U OuC6pcVU3_s Lv-2WJ599qQ 6-b6lIz6XNc NipCI-uW-IM FNVMEWqp6HA \
  8E123wCyx_o EqZ07hiJdYw rMfqWjspX54 BP6rH5upSAw xi2l8xvmt6Y 9i5Ng_yDCWI 3d19pZX8smE VFZU17PEGAs cDOOCpMYNsA 5PflA9BPugQ \
  LPgnaV8qKGM j3XmwX9ZQxI dwQwthZWIxA YBnV7hf_zFQ 9-_NYDAAxyQ QwoukRFqqHQ wGT6_7GilIk _2pSvHo0fQM GmEv3-RhEqg 7nvqnrzpADI \
  -HfF9G-AYfA 05lrtZF0Qwo ENM4ERlL8G8 50Q2sHKS-jE JOxQXl2a-zE BtT4F3zURNA Sa2KSwFufiE guih8qXEwMY 96Q0httFo8k daVa97nvg_g FG9G_0Je9Hk; do
  ls "$D/$id".* >/dev/null 2>&1 && continue
  yt-dlp -q --no-warnings -f "bv*[height<=1080][ext=mp4]/bv*[height<=1080]/b[height<=1080]" --write-info-json \
    -o "%(id)s.%(ext)s" -- "https://www.youtube.com/watch?v=$id" && echo "got $id" || echo "FAILED $id"
done
rclone copy "$D" "${R}Telugu/Medigadda/footage/raw" && echo "uploaded to ${R}Telugu/Medigadda/footage/raw"
